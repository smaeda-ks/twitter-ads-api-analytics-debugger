const Enum = Object.create(null);

Enum.ENV = {
    ASYNC: 'async',
    SYNC: 'sync'
};

Enum.STATUS = {
    SUCCESS: 'success',
    ERROR: 'danger'
};

Enum.ERROR = {
    FILE_CORRUPTED: 'Error</br><span class=\"uk-text-small\">Corrupted zip detected</span>',
    NO_JOBS_TO_FETCH: 'Error</br><span class=\"uk-text-small\">No Jobs to fetch</span>',
    MISSING_ACCOUNT_ID: 'Error</br><span class=\"uk-text-small\">Account ID is required</span>'
};

Enum.ENTITY_TYPE = [
    'ACCOUNT',
    'FUNDING_INSTRUMENT',
    'CAMPAIGN',
    'LINE_ITEM',
    'ORGANIC_TWEET',
    'PROMOTED_TWEET',
    'MEDIA_CREATIVE',
    'PROMOTED_ACCOUNT'
]

const MODAL_ANALYTICS_DATA_MESSAGE = ({ endpointType, data }) =>
    `
<button class="uk-modal-close-default" type="button" uk-close></button>
<div class="uk-modal-header">
    <h2 class="uk-modal-title">${endpointType} Job Data</h2>
</div>

<div class="uk-modal-body" uk-overflow-auto>
    <textarea id="log-view" class="uk-textarea" readonly="true"
    style="resize: auto; overflow-y: scroll; height: 400px; background-color:LightGray;">${JSON.stringify(data, null, 4)}</textarea>
</div>

<div class="uk-modal-footer uk-text-right">
    <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
    <button class="uk-button uk-button-primary" type="button">Save</button>
</div>
`;

const MODAL_NOTIFICATION_MESSAGE = ({ status, message }) =>
    `
<button class="uk-modal-close-default" type="button" uk-close></button>
<div class="uk-modal-header">
    <h2 class="uk-modal-title">Error code: ${status}</h2>
</div>

<div class="uk-modal-body" uk-overflow-auto>
    <textarea id="log-view" class="uk-textarea" readonly="true"
    style="resize: auto; overflow-y: scroll; height: 400px; background-color:LightGray;">${message}</textarea>
</div>

<div class="uk-modal-footer uk-text-right">
    <button class="uk-button uk-button-default uk-modal-close" type="button">Close</button>
</div>
`;

const CONFIG_WINDOW_TEMPLATE = () =>
    `
<div class="uk-modal-dialog uk-modal-body">
    <div class="uk-modal-header">
        <h2 class="uk-modal-title">Tokens</h2>
    </div>

    <span class="uk-text-small">Tokens will be securely saved into the system's keychain <span uk-icon="happy"></span>

    <form class="uk-margin-remove-left uk-form-stacked" id="config-form" ref="ref-config-form" v-on:keydown="trapTabKey($event)">
        <div v-for="(value, key) in data" class="uk-margin uk-margin-small-top uk-margin-small-right uk-margin-small-bottom uk-text-small uk-width-1-1">
            <label class="uk-form-label uk-text-primary	uk-text-bold required" for="form-stacked-text">{{ key }}</label>
            <input class="uk-input uk-form-small" v-bind:id="key" type="text" placeholder="" v-bind:value="value" v-on:input="updateSecret(key, $event.target.value)" required>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button id="closeConfigBtn" v-on:click="resetTokens" class="uk-button uk-button-default uk-modal-close" type="button">Close</button>
            <button id="save-tokens-button" v-on:click="saveTokens($event)" class="uk-button uk-button-primary" type="button">Save</button>
        </div>
    </form>
</div>
`;

Enum.MODAL_TEMPLATE = {
    CONFIG_WINDOW: CONFIG_WINDOW_TEMPLATE,
    MODAL_ANALYTICS_DATA: MODAL_ANALYTICS_DATA_MESSAGE,
    MODAL_NOTIFICATION: MODAL_NOTIFICATION_MESSAGE
};

Enum.TIME_24H = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"
]

Enum.SEGMENTATION_TYPE = [
    "AGE",
    "APP_STORE_CATEGORY",
    "AUDIENCES",
    "CITIES",
    "CONVERSATIONS",
    "CONVERSION_TAGS",
    "DEVICES",
    "EVENTS",
    "GENDER",
    "INTERESTS",
    "KEYWORDS",
    "LANGUAGES",
    "LOCATIONS",
    "PLATFORMS",
    "PLATFORM_VERSIONS",
    "POSTAL_CODES",
    "REGIONS",
    "SIMILAR_TO_FOLLOWERS_OF_USER",
    "TV_SHOWS"
]

Object.freeze(Enum);

module.exports = Enum;
