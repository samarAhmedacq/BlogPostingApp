import { CosmosClient } from "@azure/cosmos";

const CONNECTION_STRING = "AccountEndpoint=https://a360-solutions.documents.azure.com:443/;AccountKey=L4pS9M5iTov6bbE05xC6JjDB5N4YuaQu73GrWevwnnYXNhLqRmixQGJRCriS1y62B9K5pMNx3otuACDbX2UZlw==;";



const blogsService = {
  
  init() {
    try {
      this.client = new CosmosClient(CONNECTION_STRING);
      this.database = this.client.database("BlogsApp");
      this.container = this.database.container("blogs");
    } catch (err) {
      console.log(err.message);
    }
  },
  async create(blogToCreate) {
    const { resource } = await this.container.items.create(blogToCreate);
    return resource;
  },
  async read(): Promise<string> {
    const iterator = this.container.items.readAll();
    const { resources } = await iterator.fetchAll();
    const items = resources.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      tags:item.tags
    }));
    return JSON.stringify(items);
  },
  async update(id, title, newContent,newtags) {
    let blog = {
      id: id,
      title: title,
      content: newContent,
      tags:newtags
    };
    const { resource } = await this.container.item(id, title).replace(blog);
    return resource;
  },

  async delete(id, titleName) {
    const result = await this.container.item(id, titleName).delete();
  },

  async search(keyWord) {
    const querySpec = {
        query: 'SELECT * FROM c WHERE CONTAINS(c.title, @keyword)',
        parameters: [
          {
            name: '@keyword',
            value: keyWord,
          },
        ],
      };
  
      // Execute the query
      const { resources: results } = await this.container.items.query(querySpec).fetchAll();
      return results;
  },
};

blogsService.init();

export default blogsService;
