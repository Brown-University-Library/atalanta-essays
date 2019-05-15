![Furnace & Fugue](http://atalanta.dev.jakeandco.com/images/logo.png)

The F&F site development uses Hugo, a static HTML and CSS website generator written in Go.

## How to Install

While there are no dependencies to using Hugo itself, this project configuration requires a few packages to be fully up and running in your local environment.

### Install Hugo.
The easiest way to install Homebrew on a Mac is to use Homebrew, a package manager for your command line.

1. Install Homebrew (https://brew.sh/).
2. Once installed, use homebrew to install Hugo on the command line by running: `brew install hugo`

### Install Node.js and packages.
Hugo automatically compiles/minifies SCSS and JS, and you'll need to have Node installed (if you don't already) along with two prerequisite packages.

1. Install Node using the Mac or Windows installer (https://nodejs.org/en/download/).
2. Now you'll install two Node packages:
   - `npm install -g postcss-cli`
   - `npm install -g autoprefixer`
  
### Start the Hugo Server
Once all of the above installations are complete, you can run Hugo on the command line and access the local server. To do this:

1. `cd` to the root directory of the project (wherever you cloned this repository).
2. Run `hugo server -D`
3. The outut from the above command will show your local server address (normally http://localhost:1313). Visit that URL and you'll see your local server up and running.

When using the `-D` flag as shown above on the hugo server, the server will live reload in your browser upon changes to any files in the project.

Happy coding!