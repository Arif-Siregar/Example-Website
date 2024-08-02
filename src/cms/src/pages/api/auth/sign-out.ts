import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    try {
        await supabase.auth.signOut();

        res.setHeader(
            'Set-Cookie',
            cookie.serialize('sb:token', '', {
                maxAge: -1,
                path: '/',
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
            })
        );

        res.writeHead(302, { Location: '/admin' });
        res.end();
    } catch (error) {
        console.error('Error signing out:', error);
        res.status(500).json({ error: 'An error occurred while trying to sign out' });
    }
}
