const express = require("express");
const router = express.Router();
const { encrypt, decrypt } = require("../utils/encryption");
const { requiresAuth } = require("express-openid-connect");

let snippets = [
  {
    id: 1,
    language: "Python",
    code: "print('Hello, World!')",
  },
  {
    id: 2,
    language: "Python",
    code: "def add(a, b):\n    return a + b",
  },
  {
    id: 3,
    language: "Python",
    code: "class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14 * self.radius ** 2",
  },
  {
    id: 4,
    language: "JavaScript",
    code: "console.log('Hello, World!');",
  },
  {
    id: 5,
    language: "JavaScript",
    code: "function multiply(a, b) {\n    return a * b;\n}",
  },
  {
    id: 6,
    language: "JavaScript",
    code: "const square = num => num * num;",
  },
  {
    id: 7,
    language: "Java",
    code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  {
    id: 8,
    language: "Java",
    code: "public class Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int getArea() {\n        return width * height;\n    }\n}",
  },
];

snippets = snippets.map((snippet) => ({
  ...snippet,
  code: encrypt(snippet.code),
}));

router.get("/snippets", requiresAuth(), (req, res) => {
  const { language } = req.query;

  let filteredList = snippets;

  if (language) {
    filteredList = filteredList.filter(
      (snippet) => snippet.language === language
    );
  }

  res.json(filteredList);
});

router.get("/snippet/:id", requiresAuth(), (req, res) => {
  const snippet = snippets.find(
    (snippet) => snippet.id === parseInt(req.params.id, 10)
  );
  if (snippet) {
    snippet.code = decrypt(snippet.code);
    res.json(snippet);
  } else {
    res.status(404).json({ message: "Snippet not found" });
  }
});

router.post("/snippet", requiresAuth(), (req, res) => {
  const { language, code } = req.body;

  const newSnippet = {
    id: snippets.length > 0 ? snippets[snippets.length - 1].id + 1 : 1,
    language,
    code: encrypt(code),
  };

  snippets.push(newSnippet);
  res.json(newSnippet);
});

module.exports = router;
