export const SITE_NAME = "skyblue"

export const STYLED_SITE_NAME = "skybblue"

export const ASANA_TOKEN = process.env.ASANA_TOKEN;

export const ASANA_PROJECT_ID = process.env.ASANA_PROJECT_ID;

export const ASANA_FAQS_PROJECT_ID = process.env.ASANA_FAQS_PROJECT_ID;

export const ASANA_FEATURES_PROJECT_ID = process.env.ASANA_FEATURES_PROJECT_ID;

export const fetcher = (url: string)=>fetch(url).then((res)=>res.json());