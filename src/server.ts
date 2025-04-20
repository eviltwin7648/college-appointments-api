import app from './app';
import { connectToDB } from './db/db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectToDB();
        app.listen(PORT, () => {
            console.log('App is running on port ' + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer()