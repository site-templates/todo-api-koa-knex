require("dotenv").config();

const Koa = require("koa");
const koaBody = require("koa-body");
const logger = require("koa-logger");
const session = require("koa-session");
const passport = require("koa-passport");
const router = require("./routes");
const app = new Koa();

app.keys = [process.env.SESSION_SECRET];

require('./services/auth');

app.use(logger())
    .use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (process.env.DEBUG) {
                console.error(err)
            }
            const message = "Internal server error";
            ctx.status = err.statusCode || 500;
            ctx.body = {
                error: err.data || { message },
            };
        }
    })
    .use(session({}, app))
    .use(koaBody())
    .use(passport.initialize())
    .use(passport.session())
    .use(router.routes());

module.exports = app;
