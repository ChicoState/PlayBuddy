# UI Plan

- [UI Plan](#ui-plan)
  - [Nav bar 1](#nav-bar-1)
  - [Nav bar 2](#nav-bar-2)
  - [Footer](#footer)
  - [Routes](#routes)
    - [/ (root)](#-root)
    - [/home](#home)
    - [/user/](#user)
    - [/user/#/edit](#useredit)
    - [/login](#login)
    - [/logout](#logout)
    - [/register](#register)
    - [/activitylist](#activitylist)
    - [/activity/#/](#activity)
    - [/faq](#faq)
    - [/contact](#contact)

## Nav bar 1

Appears at the top of the page if the user is logged in. Links to the following: /, /home, /user/# (your profile), /logout, and /activitylist.

## Nav bar 2

Appears at the top of the page if the user is not logged in. Links to the following: /home, /login, /register, and /activitylist.

## Footer

Always appears at the bottom of the page. Links to the following: /faq, /contact

## Routes

### / (root)

Landing page that serves as a home page if you are logged in.
(Redirects to /home if you are not logged in.)
Links to your profile and shows a list of activities you have created, have signed up for, and have set as watched.
You can also create an activity from here, which creates a blank activity and redirects you to /activity/#/edit.

### /home

Advertises the services of the site.
Shows photos of happy, outgoing people having a rip-roaring time playing sports, music, games, etc. Links to /login, /signup, and /activitylist.

### /user/

The profile page for a user.
Lists information about them, tags that are relevant to types of activities, general location (if provided), etc.
Links to /user/#/edit if that user is who is logged in.

### /user/#/edit

Edit profile details and settings

### /login

Lets you put in your account credentials to enter the logged-in state. takes user to / when done.

### /logout

Logs the user out and tells them they have been logged out.

### /register

Create an account. Takes user to /user/#/edit when done.

### /activitylist

The main attraction.
Lets the user filter (and possibly search) activities.
Filters on by default filter out activities that are far away and aren't starting within a day or two.
Other filters include things such as type of activity (sports, music, gaming, tabletop, misc), skill level (first timer, beginner, intermediate, advanced, professional.
These are meant to be vague so they can apply to any of the activities. Activities don't have to use these filters if they want them to be open to everyone, but things like jam sessions might want professionals to not be jamming with beginners.)
And other filters.
We need to decide how activities should be sorted.
You can of course tap on an activity to open that activity's /activity/# page.
If you are logged in, you can also create an activity from here, which creates a blank activity and redirects you to /activity/#/edit.

### /activity/#/

Page for a specific activity.
Gives the full, non-truncated description for the activity.
It also says how many people have signed up, as well as a list of people who have signed up.
(At the bottom, it will say "and 7 more" for anonymous sign-ups.)
You can sign up yourself.
You can also watch the activity to be able to easily access the activity from / (and possibly email alerts down the line).
If you sign up, you are prompted to also watch the list.
If the activity is repeated (weekly activities, for example), you may opt to watch it until the activity happens once, or to keep it watched.
(Unsure if the user should be able to sign up for the activity perpetually.
Saves work for people who want to attend every week, but could result in people setting it and forgetting about it, which results in a bunch of people signed up forever who will never attend.)
This page links to /activity/#/edit if you have edit access to this activity.
Also lets you edit the activity if you have edit access to it.
You can set the title, description, filter tags, etc. You can also set whether the activity should be listed.
(This is off by default, so just hitting the create button won't list a blank activity.)

### /faq

Provides some helpful information about the website's functionality.

### /contact

Contact the developers of the website.
(We might want to get an email for the company developers after we've decided on a name and reserved a domain name.)
