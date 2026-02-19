"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetatmoApi = void 0;
class NetatmoApi {
    constructor() {
        this.name = 'netatmoApi';
        this.displayName = 'Netatmo API';
        this.documentationUrl = 'https://dev.netatmo.com/';
        this.properties = [
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                required: true,
                description: 'The Client ID from your Netatmo application',
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The Client Secret from your Netatmo application',
            },
            {
                displayName: 'Refresh Token',
                name: 'refreshToken',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
                description: 'The Refresh Token obtained from Netatmo OAuth flow',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {},
        };
    }
}
exports.NetatmoApi = NetatmoApi;
