# Remix Movies Example

This movie database serves as an example for various data loading strategies in Remix.

[Watch the "Remix Singles" on YouTube](https://www.youtube.com/playlist?list=PLXoynULbYuEApkwAGZ7U7LmL-BDHloB0l)

## Local Development

To get started create a `wrangler.toml` configuration file, which will provide information like our database name.

```sh
cp wrangler.example.toml wrangler.toml
```

You'll notice that the `name` and `database_name` are already filled in. [Deploying to Cloudflare](#deploying-to-cloudflare) shows you how to create a Pages project and D1 database, which you can name these whatever you want.

To create and seed your local database, run the following. There is a lot of data, so this may take a little while.

```sh
npm run db:migrate -- --local
```

You can now start the app locally.

```sh
npm run dev
```

## Deploying to Cloudflare

### Create/log in to your Cloudflare account

The deployed version of this application uses [Cloudflare Pages](https://developers.cloudflare.com/pages/) and [Cloudflare D1](https://developers.cloudflare.com/d1/). In order to create and use these resources, you'll first need to log in to your Cloudflare account.

If you don't have an account this command will take you to a page where you can create one for free.

```sh
npx wrangler login
```

### Create a D1 database

First we need to provision a new D1 database. Be sure to copy the `database_id` returned and add it to your `wrangler.toml`.

```sh
npx wrangler d1 create remix-movies-db
```

To setup and seed the database, run the following

> [!WARNING]
> D1 is still in public beta (as of the making of this example app), and we're trying to seed
> _a lot_ of data, so this migration may fail! You might have to try running it a few times.

```sh
npm run db:migrate
```

### Create a Cloudflare Pages project

Run the following to setup a new Cloudflare Pages project

```sh
npx wrangler pages project create remix-movies
```

Before you deploy your application, you'll need to bind your D1 database to your Pages Function.

Select your Pages project > **Settings > Functions > D1 database bindings > Add binding**.

Name the **Variable name** "DB" and select `remix-movies-db` (or whatever you named your D1 database) from the dropdown and hit **Save**.

> [!NOTE]  
> If you are deploying a preview (i.e. on a non-`main` branch) you'll need to setup a D1 binding under the **Preview** tab

If you get stuck, visit the [Cloudflare docs for the full instructions](https://developers.cloudflare.com/pages/functions/bindings/#d1-databases)

Now you're ready to deploy your site!

```sh
npm run pages:deploy
```
