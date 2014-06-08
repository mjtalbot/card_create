# Card Create [![Build Status](https://travis-ci.org/mjtalbot/card_create.svg?branch=master)](https://travis-ci.org/mjtalbot/card_create)


##Overview
Card Create is a simple tool to help create card games.

You have cards and templates.
* Cards comprise of a key value store for cards attributes such as
name, description or images. For ease of adding test cards these can be imported from
Twitter.
* Templates specify the layout of the resulting card. They can also have additional
attributes themselves, and are themselves made up of several layers.
* Layers have essetially css design elements which the user can fully customize
they also carry a 'text' and a 'background image' tag. both of these are optional
you can enter normal text, or urls here, alternatively you can enter #keyword.
when you use a # it will try to locate the keyword first in the card's attributes
and then in the templates attributes and replace itself with whatever is specified there


##Installation
Card creates requirements are specified in requirements.txt (https://github.com/mjtalbot/card_create/blob/master/requirements.txt)

##Configuration
Card create uses a yaml style configuration file

```
twitter:
    key: <twitter_key>
    secret: <twitter_secret>
app:
    port: 5000
storage:
    card: <path_to_card_store>
    resource: <path_to_resource_store>
    template: <path_to_template_store>
```

Cards are stored in json format in the card store.
Template are stored in json format in the template store
Resources hold uploaded images.

##Run

To startup a server simply run
```
python app.py <path_to_config>
```

##TODO
There is a lot to do for card create to become complete, below is an overview
of what is planned.

* remove twitter dependency from startup
* clone cards
* preview whole deck of cards
* add tagging to cards
* add card/template ownership
* manage deletion of unused resources
* export cards to pdf
* add unit tests
* add build environment
