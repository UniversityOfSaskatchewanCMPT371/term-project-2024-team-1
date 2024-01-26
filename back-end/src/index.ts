import "reflect-metadata";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { TestService } from "./adapter/TestService";
import { UserSQL } from "./adapter/UserSQL";
import { UserOther } from "./adapter/UserOther";

//logging 
import log4js from 'log4js';
import {getLogger, configure} from 'log4js';

configure('src/log4js-config.json')

const config =  require('./config.ts');
const express =  require('express');
const app =  express();
const info_logger = getLogger('info'); // logger for info
const err_logger = getLogger('error'); // logger for error
const debug_logger = getLogger('debug'); // logger for debug

console.log(`NODE_ENV=${config.NODE_ENV}`);


export const sum = (a: number, b: number) => a+b;


app.get('/', (req: Request, res: Response) => {
    info_logger.info('GET request received');
    const t = container.resolve(TestService);
    t.call();    
    res.send('Hello World !!');
});

app.listen(config.PORT, config.HOST, () => {
    err_logger.error("Testing ERROR logs")
    debug_logger.debug("Testing DEBUG logs")
    console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
    
})

container.register("User", {useClass: UserOther});