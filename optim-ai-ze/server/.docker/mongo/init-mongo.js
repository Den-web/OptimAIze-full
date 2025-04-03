// Create main database and user
db = db.getSiblingDB('optim-ai-ze');

// Create collections with validation
db.createCollection('prompts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'content', 'createdAt', 'updatedAt'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'Title of the prompt'
        },
        description: {
          bsonType: 'string',
          description: 'Description of the prompt'
        },
        content: {
          bsonType: 'string',
          description: 'Content of the prompt'
        },
        tags: {
          bsonType: 'array',
          description: 'Tags for the prompt',
          items: {
            bsonType: 'string'
          }
        },
        createdAt: {
          bsonType: 'date',
          description: 'Date when the prompt was created'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Date when the prompt was last updated'
        }
      }
    }
  }
});

// Create indexes
db.prompts.createIndex({ title: 1 }, { unique: true });
db.prompts.createIndex({ tags: 1 });

// Create a default prompt for testing
db.prompts.insertOne({
  title: 'Welcome Prompt',
  description: 'A default welcome prompt',
  content: 'Hello! This is a sample prompt to help you get started with OptimAIze.',
  tags: ['sample', 'welcome'],
  createdAt: new Date(),
  updatedAt: new Date()
}); 