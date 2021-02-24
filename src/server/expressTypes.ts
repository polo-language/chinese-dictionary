import * as express from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { URLSearchParams } from 'url'

export type Request = express.Request<
    ParamsDictionary,
    any,
    any,
    URLSearchParams,
    Record<string, any>
>
