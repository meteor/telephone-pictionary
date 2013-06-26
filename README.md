# Telephone-Pictionary is a game where you alternately draw phrases and describe drawings.

This is meant to be a crash course in the Meteor Javascript web framework.  The
`master` branch of this repository is not fully implemented; finishing the
implementation is left as an exercise to the reader.  The `solution` branch of
this repository is a working game.

# Walkthrough

Throughout this course, you can use `git grep PHASE N` to find spots in the code
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

-- More comments on the code already there. PHASE 1 EXAMPLE for ex.

## Phase 1

Here you'll be getting used to Meteor's reactive templating system.  That sounds
fancy and complicated, but what it really means is that Meteor does its best to
tell when the information substituted into your HTML templates changes, and
automatically re-renders the templates for you on the page.

The task here is to add color support to our drawing program.  You'll be working
in `client/draw.js` and `client/draw.html`.

 --- Talk about template helpers.
 --- Meteor repalces double curlies
 --- Special double-curly-with-hash for flow control if/each
 --- In Meteor you rarely want href attrs; you don't want links to reload the page.

## Phase 2

-- Meteor adds


## Phase 3

-- Findign the game to put the move in could be the assignment, cut the rest of it.

## Phase 6

-- Reference to docs and a lil lecture