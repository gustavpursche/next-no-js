// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookies from "cookies";
import { FieldError, validate } from "../../lib";

export default (req, res) => {
    switch (req.method) {
        case "POST": {
            const { email } = req.body;
            if (email === "dup@example.com") {
                const errors: FieldError[] = [
                    {
                        message: "This email already exists. Please use another",
                        path: ["email"],
                    },
                ];
                return delay(() => error(req, res, errors, { email }));
            }
            const errors = validate(req.body);
            if (errors.length) {
                return delay(() => error(req, res, errors, { email }));
            }
            return delay(() => redirect(req, res, "/account"));
        }
        default: {
            return delay(() => redirect(req, res, "/"));
        }
    }
};

function error(req, res, errors: FieldError[], values: Record<string, string>) {
    const jsonResp = req.headers["content-type"] === "application/json";
    const json = { values, errors };
    if (jsonResp) {
        return res.status(400).json({ kind: "error", values, errors });
    }
    try {
        const cookies = new Cookies(req, res);
        cookies.set("error", Buffer.from(JSON.stringify(json)).toString("base64"), { httpOnly: true });
    } catch (e) {
        console.error("could not set cookie", e);
    }
    return redirect(req, res, req.headers.referer || "/");
}

function redirect(req, res, to) {
    const jsonResp = req.headers["content-type"] === "application/json";
    if (jsonResp) {
        return res.status(200).json({ kind: "redirect", to });
    }
    res.setHeader("location", to);
    res.statusCode = 302;
    return res.end();
}

function delay(fn) {
    setTimeout(fn, 1000);
}
