import "reflect-metadata";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { TestService } from "./adapter/TestService";
import { UserSQL } from "./adapter/UserSQL";
import { UserOther } from "./adapter/UserOther";

const config =  require('./config.ts');
const express =  require('express');
const app =  express();

console.log(`NODE_ENV=${config.NODE_ENV}`);

app.get('/', (req: Request, res: Response) => {
    const t = container.resolve(TestService);
    t.call();
    res.send('Hello World !!');
});

app.listen(config.PORT, config.HOST, () => {
    console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
})

container.register("User", {useClass: UserOther});