const Enum = require('./utils/enum');
const electron = require('electron');
const keytar = require('keytar');
const os = require('os');
const HttpClient = require('./utils/http');
const zlib = require('zlib');

const { app, ipcMain, BrowserWindow, Menu } = electron;
const isMac = process.platform === 'darwin';

if (process.argv[2] == '--dev') {
    require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`)
    });
}

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Speech',
                    submenu: [
                        { role: 'startspeaking' },
                        { role: 'stopspeaking' }
                    ]
                }
            ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            // { role: 'reload' },
            // { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
            ] : [
                    { role: 'close' }
                ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { electron.shell.openExternal('https://electronjs.org') }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

let mainWindow = null;

app.on('window-all-closed', () => {
    app.quit();
    return
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 850,
        height: 850,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextisolation: true,
            nodeIntegration: false
        }
    });
    mainWindow.autoHideMenuBar = true;
    mainWindow.loadURL('file://' + __dirname + '/renderer/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    return
});

const keytarServiceBaseName = 'Electron-TwitterAds-Analytics-Debugger';
const keytarAccount = os.userInfo().username;

const getTokensFromKeyChain = async () => {
    const tokens = {};
    tokens.consumer_key = await keytar.getPassword(`${keytarServiceBaseName}-consumer-key`, keytarAccount);
    tokens.consumer_secret = await keytar.getPassword(`${keytarServiceBaseName}-consumer-secret`, keytarAccount);
    tokens.access_token = await keytar.getPassword(`${keytarServiceBaseName}-access-token`, keytarAccount);
    tokens.token_secret = await keytar.getPassword(`${keytarServiceBaseName}-token-secret`, keytarAccount);
    return tokens
};

const getTokensAndCheckNull = async () => {
    const tokens = await getTokensFromKeyChain();
    return (Object.values(tokens).includes(null)) ? false : tokens
}

// get saved tokens from keychain
ipcMain.handle('getTokens', async (event) => {
    return await getTokensFromKeyChain()
});

// save tokens into system's keychain
ipcMain.handle('setTokens', async (event, tokens) => {
    await keytar.setPassword(`${keytarServiceBaseName}-consumer-key`, keytarAccount, tokens.consumer_key);
    await keytar.setPassword(`${keytarServiceBaseName}-consumer-secret`, keytarAccount, tokens.consumer_secret);
    await keytar.setPassword(`${keytarServiceBaseName}-access-token`, keytarAccount, tokens.access_token);
    await keytar.setPassword(`${keytarServiceBaseName}-token-secret`, keytarAccount, tokens.token_secret);
    return true
});

ipcMain.handle('sendAsyncRequest', async (event, account_id, params, headers = {}) => {
    const tokens = await getTokensAndCheckNull();
    if (tokens === false) {
        event.sender.send('sendNotification', Enum.STATUS.ERROR, `Please set token first.`);
        return 'error'
    }
    console.log(params)

    const client = new HttpClient(account_id, tokens);
    return client.post_async_jobs(params, headers)
        .then(res => {
            let json = JSON.parse(res);
            event.sender.send('sendNotification', Enum.STATUS.SUCCESS, `Created: ${json.data.id_str}`);
            return json.data.id_str
        })
        .catch(([statsCode, body]) => {
            event.sender.send('sendDialogErrorNotification', statsCode, body);
            return 'error'
        })
});

ipcMain.handle('sendSyncRequest', async (event, account_id, params, headers = {}) => {
    const tokens = await getTokensAndCheckNull();
    if (tokens === false) {
        event.sender.send('sendNotification', Enum.STATUS.ERROR, `Please set token first.`);
        return 'error'
    }

    const client = new HttpClient(account_id, tokens);
    return client.get_sync_data(params, headers)
        .then(res => {
            return JSON.parse(res)
        })
        .catch(([statsCode, body]) => {
            event.sender.send('sendDialogErrorNotification', statsCode, body);
            return 'error'
        })
});

ipcMain.handle('fetchJobs', async (event, account_id, params, headers = {}) => {
    const tokens = await getTokensAndCheckNull();
    if (tokens === false) {
        event.sender.send('sendNotification', Enum.STATUS.ERROR, `Please set token first.`);
        return []
    }

    const client = new HttpClient(account_id, tokens);
    return client.get_async_jobs(params, headers)
        .then(res => {
            return JSON.parse(res).data.map((obj) => {
                return [obj.id_str, obj.status, obj.url]
            });
        })
        .catch(([statsCode, body]) => {
            event.sender.send('sendDialogErrorNotification', statsCode, body);
            return []
        })
});

ipcMain.handle('fetchData', async (event, url) => {
    const client = new HttpClient();
    return client.get_async_data(url)
        .then(async (res) => {
            const data = await unGzip(res);
            return JSON.parse(data.toString('utf-8'))
        })
        .catch(([statsCode, body]) => {
            event.sender.send('sendDialogErrorNotification', statsCode, body);
            return 'error'
        })
});

const unGzip = (data) => {
    const promise = new Promise(function (resolve, reject) {
        zlib.gunzip(data, function (error, result) {
            if (!error) resolve(result);
            else reject(Error(error));
        });
    });
    return promise
}
