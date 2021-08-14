import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';

const options: NextAuthOptions = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    database: process.env.DATABASE_URL || {
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
    },
    session: {
        jwt: true,
    },
    callbacks: {
        session: async (session, user) => {
            session.jwt = user.jwt;
            session.id = user.id;
            return Promise.resolve(session);
        },
        jwt: async (token, user, account) => {
            const isSignIn = user ? true : false;
            if (isSignIn && account) {
                const response = await fetch(
                    `${process.env.API_URL}/auth/${account.provider}/callback?access_token=${account.accessToken}`
                );
                const data = await response.json();
                token.jwt = data.jwt;
                token.id = data.user.id;
            }
            return Promise.resolve(token);
        },
    },
};

const Auth: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default Auth;
