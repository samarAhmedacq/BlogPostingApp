import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import blogsService from "../service/blogService";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  let response;

  try {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;
    const result = await blogsService.update(id, title, content,tags);
    response = { body: result, status: 200 };
  } catch (err) {
    response = { body: err.message, status: 500 };
  }

  context.res = response;
};

export default httpTrigger;
