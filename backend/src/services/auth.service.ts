import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    ConfirmSignUpCommand,
    ResendConfirmationCodeCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from '../config';

const client = new CognitoIdentityProviderClient({ region: config.AWS_REGION });

export class AuthService {
    async signup(email: string, password: string, name: string) {
        const command = new SignUpCommand({
            ClientId: config.COGNITO_CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'name', Value: name },
            ],
        });

        return client.send(command);
    }

    async verify(email: string, code: string) {
        const command = new ConfirmSignUpCommand({
            ClientId: config.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
        });

        return client.send(command);
    }

    async resendVerificationCode(email: string) {
        const command = new ResendConfirmationCodeCommand({
            ClientId: config.COGNITO_CLIENT_ID,
            Username: email,
        });

        return client.send(command);
    }

    async login(email: string, password: string) {
        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: config.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        });

        return client.send(command);
    }

    async forgotPassword(email: string) {
        const command = new ForgotPasswordCommand({
            ClientId: config.COGNITO_CLIENT_ID,
            Username: email,
        });

        return client.send(command);
    }

    async resetPassword(email: string, code: string, newPassword: string) {
        const command = new ConfirmForgotPasswordCommand({
            ClientId: config.COGNITO_CLIENT_ID,
            Username: email,
            ConfirmationCode: code,
            Password: newPassword,
        });

        return client.send(command);
    }

    async refreshToken(refreshToken: string) {
        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: config.COGNITO_CLIENT_ID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
            },
        });

        return client.send(command);
    }
}
