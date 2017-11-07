# Microsoft Edge Welcome 

## Running the site locally
1. Clone the repostiory to your machine.
1. Install NodeJS from [http://nodejs.org/](http://nodejs.org)
1. Open a command prompt and navigate to the project's root directory (where you cloned the repository)
1. Run the command "npm install" to install grunt and its plugins
1. Run the command "npm install -g grunt-cli" to install grunt command line globally
1. Run "grunt" to build the project
1. Run the command "npm install -g nodemon" to install nodemon, a utility to automatically restart NodeJS when changes to source are detected.
1. Run the command "nodemon" to start the development server
1. Open your browser to http://localhost:3000

## Groups
The site is split up into groups, which each have their own css, js, and localized strings. A group might be a single page or it could be a set of pages that share styles, strings, and script.

### ExpressJS
Express is the web server that runs on top of NodeJS to serve the site. The main entry point is server/app.js which lists all the middleware which will be run for a request.

### Routes
All the URL routes are declared in server/middleware/routes.js. The logic for each route can be declared in separate files, for example server/routes/rootRoutes.js. 

### Views
A view is a templated HTML file located in the /server/views folder. We use the Handlebars templating language (http://handlebarsjs.com/). There is a layout named main.html in the server/views/layouts folder. It contains the basic page structure shared by all pages (but doesn't contain any content).

### Strings
Strings are partitioned by group and stored under the localdata/localeStrings/[group-id] folder. Each locale has it's own JSON file, matching what the LionBridge localization team provides. All of the strings are automatically loaded and provided to the tempalted view in the strings property. The locale is also automatically detemined so the page will have the appropriate strings for the current locale. Here is an example of how you would render a string in the view:

{{strings.restore.weResolvedIt}}

### Grunt entry for Groups
There is an array at the top of the Gruntfile.js named groupIds which contains the names of the groups. If you add an entry to this list, Grunt will automatically try to build a JS and CSS file for the group. For JavaScript it will automatically include all the files under client/js/[group-name] and for css it will build the SASS file at client/scss/[group-name].scss.

### Locale Customization
Each page has the locale set as a css class on the body. So its easy to write CSS that targets only a specific locale. For example, here is some CSS which modifies the font size for French:

.fr-fr h4 { 
    font-size: 16px; 
}






