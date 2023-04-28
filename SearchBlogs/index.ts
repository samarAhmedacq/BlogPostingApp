import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import blogsService from "../service/blogService";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  let response;

  try {
    const keyWord = req.query.keyword;
    let blogs = await blogsService.search(keyWord);
    response = { body: blogs, status: 200 };
  } catch (err) {
    response = { body: err.message, status: 500 };
  }

  context.res = response;
};

export default httpTrigger;
