# Telephone-Pictionary is a game where you alternately draw phrases and describe drawings.

This is meant to be a crash course in the Meteor Javascript web framework.  The
`master` branch of this repository is not fully implemented; finishing the
implementation is left as an exercise to the reader.  The `solution` branch of
this repository is a working game.

# Walkthrough

Throughout this course, you can use `git grep PHASE N` to find spots in the code
relevant to the phase you're working on.

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

The task here is to add color support to our drawing program.
