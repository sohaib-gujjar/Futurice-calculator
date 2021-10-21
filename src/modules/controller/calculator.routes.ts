import express, { NextFunction, Request, Response } from "express";
import CalculatorService from "../service/calculator.service";

/**
 * Router Definition
 */

export default class CalculatorController {
  public path = '/calculus';
  public router = express.Router();
  private service = new CalculatorService();

  constructor(app: express.Application) {
    // middleware for controller
    this.router.use(function (req, res, next) {
      console.log('Calculator controller :', req.originalUrl)
      next()
    });
    this.initializeRoutes();
    app.use("/", this.router);
  }

  public initializeRoutes() {
    this.router.get(`${this.path}`, this.calculate);
  }

/**
 * @swagger
 * paths:
 *  /calculus?query=[input]:
 *   get:
 *     summary: calculator service
 *     description: >
 *      The service offers an endpoint that reads math expression as a string input and calculate result.
 *      **[Shunting-yard algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)**
 *     parameters:
 *      - in: query
 *        name: query
 *        required: true
 *        schema: {
 *          type: "string",
 *          format: "binary"
 *        }
 *        description: math expression
 *        example: 2 * (23/(3*3))- 23 * (2*3)
 *     responses:
 *       '200':
 *         description: return json object
 *       '500':
 *         description: return HTTP error
 */
  calculate = async (req: express.Request, res: express.Response) => {
    try {
      //const query = req.params.query;
      let query: string = req.query.query.toString();
      console.log(req.query)
      const result: any = await this.service.calculate(query);
      res.status(200).send(result);
    } catch (e) {
      res.status(500).send(e);
    }
  }

}