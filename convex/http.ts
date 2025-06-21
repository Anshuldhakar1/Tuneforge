import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/spotify/callback",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error || !code || !state) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Spotify Connection Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Connection Failed</h1>
            <p>Error: ${error || 'Missing authorization parameters'}</p>
            <script>
              console.log('Sending error message to parent');
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'spotify-error', 
                  error: ${JSON.stringify(error || 'Missing code or state')}
                }, '*');
              }
              setTimeout(() => { 
                console.log('Closing popup');
                window.close(); 
              }, 3000);
            </script>
          </body>
        </html>
      `, { 
        status: 400,
        headers: { "Content-Type": "text/html" } 
      });
    }

    try {
      // Exchange the code for tokens using your existing action
      await ctx.runAction(api.spotifyAuth.exchangeSpotifyCode, {
        code,
        state
      });

      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Spotify Connected</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .success { color: #28a745; }
            </style>
          </head>
          <body>
            <h1 class="success">✅ Spotify Connected!</h1>
            <p>Redirecting back to the app...</p>
            <script>
              console.log('Sending success message to parent');
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'spotify-success'
                }, '*');
              }
              setTimeout(() => { 
                console.log('Closing popup');
                window.close(); 
              }, 2000);
            </script>
          </body>
        </html>
      `, { 
        status: 200,
        headers: { "Content-Type": "text/html" } 
      });
    } catch (error) {
      console.error('Spotify callback error:', error);
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Spotify Connection Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Connection Failed</h1>
            <p>Error processing authorization</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'spotify-error', 
                  error: 'Failed to process authorization'
                }, '*');
              }
              setTimeout(() => window.close(), 3000);
            </script>
          </body>
        </html>
      `, { 
        status: 500,
        headers: { "Content-Type": "text/html" } 
      });
    }
  }),
});

http.route({
  path: "/test",
  method: "GET", 
  handler: httpAction(async () => {
    return new Response("HTTP Actions are working!", { 
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }),
});

export default http;
