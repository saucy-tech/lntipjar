# Getting Started

We are going to be building this: https://lntipjar.netlify.app/

`lntipjar` is just a simple web page that allows you to receive tips over the Lightning network.

## What is the architecture?

This project uses:

### NextJS

NextJS is a javascript/typescript framework for building web applications.

### LNBits

LNBits is an "account system" that sits in front of a Lightning node. It has a simple API that we can use to interact with Lightning instead of directly talking to a Lightning node.

### phoenixd

`phoenixd` is the server version of the popular Phoenix wallet. It is simple to deploy (relatively speaking, among lightning nodes). ACINQ will automatically give you liquidity when you try to receive your first payment (for a fee).

#### A note on LNBits and phoenixd

You could actually have NextJS talk directly to phoenixd and cut out the middle-man. However, that would require the NextJS website to be hosted on the same server as phoenixd. In our situation, we don't want to deal with that.

Another advantage to using LNBits is that if you wanted to use a different Lightning node implementation at a later point, you would not need to update any code in your app. You would just repoint LNBits to the new Lightning node.

### Deployment Platforms

You can deploy this any number of ways. I like Netlify. Many folks like Vercel. You could even host this directly on a VPS if you really like to get into the weeds.