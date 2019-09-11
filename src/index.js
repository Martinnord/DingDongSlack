import Koa from "koa";
import KoaRouter from "koa-router";
import koaJson from "koa-json";
import bodyParser from "koa-bodyparser";
import render from "koa-ejs";
import path from "path";
import request from "request";
import "dotenv/config";

// app
const app = new Koa();
const router = new KoaRouter();

// middlware
app.use(koaJson());
app.use(bodyParser());

// route setup
render(app, {
  root: path.join(__dirname, "/view"),
  layout: "layout",
  viewExt: "html",
  cache: false,
  debug: false
});

function sendDingDong(msg) {
  const payload = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#qopster-tests",
      text: msg,
      username: "Ding Dong",
      icon_emoji: ":bell:"
    }
  };

  // send the payload to the slack team
  request.post("https://slack.com/api/chat.postMessage", payload, function(
    error,
    response,
    body
  ) {
    console.log("res", response);
    console.log("error", error);
  });
}

// routes
router.post("/ding-dong", dingDong);
router.get("/sit-tight", sitTight);

async function sitTight(ctx) {
  await ctx.render("sitTight");
}

async function dingDong(ctx) {
  const body = ctx.request.body;

  // send the ding dong
  sendDingDong(body.msg);

  // redirect to confirm route
  ctx.redirect("/sit-tight");

  await ctx.render("form");
}

// router middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("DING DONG"));
