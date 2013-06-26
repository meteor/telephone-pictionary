# Telephone-Pictionary Meteor Crash Course

Telephone-Pictionary is a game where you alternately draw phrases and describe
drawings.

This is meant to be a crash course in the Meteor Javascript web framework.  The
`master` branch of this repository is not fully implemented; finishing the
implementation is left as an exercise to the reader.  The `solution` branch of
this repository is a working game.

# Walkthrough

Throughout this course, you can use `git grep 'PHASE N'` to find spots in the code
relevant to the phase you're working on, if you're working on phase `N`.  For
example, to find spots in the code relevant to phase 1, type `git grep PHASE 1`.

To start playing:

* Install Meteor.  At your terminal, type:
         $ curl https://install.meteor.com | /bin/sh
* Check out this git repository
* Navigate to your checkout, and type `meteor` at your terminal.

You should now be able to go to `localhost:3000` in your browser, and have
access to a basic drawing program.  Spend a little time poking around the code,
in advance of getting down and dirty with it very soon.

## Phase 1

Here you'll be getting used to Meteor's reactive templating system.  That sounds
fancy and complicated, but what it really means is that Meteor does its best to
tell when the information substituted into your HTML templates changes, and
automatically re-renders the templates for you on the page.

The templating system Meteor uses is a variant of Handlebars.  The basics: You
invoke a template like so: `{{> templateName}}`. You enclose variable names in
double braces `{{likeThis}}`, and Meteor fills in the string contents of those
variables.

Meteor searches two places for filling in Handlebars variables:

* *Template helpers*, which are functions in your Javascript code that return
  the values to substitute.  To provide a template helper that will substitute
  `{{foo}}` in the template called `sillyWords`, assign a function to the
  variable `Template.sillyWords.foo` For example:

        Template.sillyWords.foo = function () {
          return Random.choice(["pabst", "furblig", "blick"]);
        }

* The *data context* of your template.  You can create a data context by writing
  `{{#with helper}}` or `{{#each helper}}` (closed by `{{/with}}` and
  `{{/each}}` respectively) in your html.

  A `{{#with foo}}` block evaluates `foo` (in the same way as any other
  handlebars variable), and sets the data context for everything in the block to
  be that value.

  An `{{#each foo}}` block does the same thing, but expects the value of `foo`
  to be an array or database cursor, and repeats its contents once with the data
  context set to every element of `foo`.

  Within template helpers and event handlers on templates, the value of `this`
  is the data context.

If the data context is itself a string, `{{this}}`, will substitute in the whole
data context.

Meteor supplies certain information sources that will inform template helpers
they need to rerender when the data source is changed.  The simplest of these is
`Session`.  To get a `Session` variable, use `Session.get("variableName")`, and
to set one, use `Session.set("variableName", value)`.

The task for phase 1 is to add color support to our drawing program.  You'll be
working in `client/draw.js` and `client/draw.html`.  Replace each of the PHASE 1
comments with the appropriate Handlebars and Javascript code.

Note: In Meteor, you rarely want to supply `href` attributes to links, because
clicking them reloads your page.  You want to directly process click events on
those links instead.

## Phase 2

Phase 2 is about interacting with Meteor's package system, to add the ability to
log in to our application.

At the command prompt in your application directory, type

    meteor add accounts-ui
    meteor add accounts-password

(you can instead add `accounts-facebook`, or `accounts-google` if you like).

At this point, you can add login support just by adding `{{loginButtons}}` to
the `telephone-pictionary.html` file.

We'd also like to hide most of the application's UI if the user is not logged
in, so you can add a template helper in `main.js` to return `Meteor.userId()`
(which will be null if we're not logged in), and add `{{#if
loggedIn}}`...`{{/if}}` blocks to `telephone-pictionary.html` in the spots
indicated for phase 2.


## Phase 3

The way Meteor stores data that's shared between the client and the server is in
MongoDB.  On the server, this is a direct interface to MongoDB.  On the client,
we're dealing with a pure-Javascript reimplementation of Mongo that shares a
mirror of (a subset of) the data on the server.

Mongo is a non-SQL object database with a Javascript object based query
language.  For example, for a collection `Coll`, `Coll.find({a: 3, b: "foo"})`
finds every object in the collection for which `a` is `3` and `b` is
`"foo"`. You can also use a variety of selector operations, such as
`Coll.find({a: {$lt: 3}})`, for all objects with `a` less than `3`.  Every object
in the database has an `_id` field that uniquely specifies it.

The Mongo operations of note are:

 * `Coll.find(selector)` -- finds a cursor over all objects that match the given selector object
 * `Coll.findOne(selector)` -- finds the first object that matches the given selector, if any.
 * `Coll.insert(object)` -- inserts the given object into the database
 * `Coll.update(_id, updater)` -- updates the object with the given `_id` with
   the given updater.  For example, the updater `{$set: {a: 6}}` sets the `a`
   field to `6`.
 * `Coll.remove(_id)` -- removes the specified object from the collection.

In phase 3, we'll be doing some database interaction to figure out what our user
should draw or describe, and use Meteor's remote procedure call api to inform
the client of this assignment.  In `assignments.js`, fill in the part of the
`getAssignment` RPC as indicated.  Then, in `main.js`, fill in the parts
necessary to actually make the RPC to get an assignment when needed, and to
display the assignment in the main template.

## Phase 4

Now that we have an assignment in the `"assignment"` Session variable, we can
display the assignment, not just the drawing interface all the time.  In
`telephone-pictionary.html`, change the main template to decide which of the
`draw`, `describe`, or `start` templates to use based on what fields of the
assignment are set: `picture` is set when you should describe something,
`description` is set when you should draw something, and `start` is set when you
should start something.  If there is no assignment or if we're in game-viewing
mode, display none of these.

Note: Look at `start.html`, `describe.html`, `start.js`, and `describe.js` for
the code for these other templates.  You've seen the code for the `draw`
template before.

## Phase 5

We have assignments displaying.  Now let's provide the answers to them.  In
`start.js`, `describe.js`, and `draw.js`, provide an event handler that will
gather the answer (use the `find` method on the template object to get a
particular html element in the template) and send it to the server.  Don't
forget the `submitAnswer` helper function that already exists for you in
`main.js`.

## Phase 6

At this point your game should be mostly working.  The rest is window dressing.
But kind of important window dressing... right now people never run out of time
to make their moves.  Let's implement expiry on moves, and a timer for the user
to look at while they're working.

The subtle stuff here has to do with Meteor's `Deps` package, which is the
lower-level interface to reactivity. In `timer.js`, you have a template helper
that should return the time left on the current assignment -- but it needs to
know that it should re-render regularly.  We do this by calling `depend()` on a
`Dependency` object (which will tell this function to re-run every time the
dependency is changed), and regularly calling `changed()` on the dependency
object (which will tell the dependency it has changed).

You will also have to implement some server-side assignment expiry logic with
MongoDB at the bottom of `assignments.js`.

## Phase 7

So now our app is feature-complete.  The one problem: All the clients still get
all the information in the database.  To keep this from happening, we need to
stop relying on Meteor's introductory `autopublish` package, which sends your
whole database to every client.  Instead, we'll publish only the information we
want each client to see.

To remove `autopublish`:
    meteor remove autopublish

While you're at it, also remove the `insecure` package, which allows clients
unfettered access to modify your database.
    meteor remove insecure

The simplest way to use `Meteor.publish('name', func)` is to have the function
return a Mongo cursor, possibly using the arguments of the function or
`this.userId` to determine what should be in the cursor.  You can then call
`Meteor.subscribe('name', arguments)` on the client to subscribe to the publish
function of the same name.

Find the places in `model.js` and `main.js` to implement publishes and
subscriptions, respectively.

## Appendix: How did we get here?

This walkthrough dumps you in to the middle of a Meteor project.  How did we get
from a blank filesystem to the state of the repository you checked out?

First, we created a blank application with
    meteor create telephone-pictionary

We proceeded to create `client` and `server` directories there, so that we could
easily have code execute just on the client, or just on the server, and we moved
some of the default files to the `client` directory.

Next, we added the Twitter Bootstrap package, to make styling things easier.

    meteor add bootstrap

Since we didn't want to write a whole canvas drawing program ourselves, we went
to [http://fabricjs.com/build/](http://fabricjs.com/build/) and downloaded a
build of Fabric with Interaction, Serialization, Parser, and Free Drawing
selected.  We dropped it in `client/compatibility/fabric.js` in our
project. (`client/compatibility` is a directory for third-party libraries that
expect to be able to declare global variables with the `var` keyword).

Finally, we wrote some code.