module.exports = {
    "parser": "babel-eslint",
    "extends": ["standard", "plugin:react/recommended"],
    "plugins": [
        "standard",
        "promise",
        "react"
    ],
    "rules": {
      "semi": [2, "always"]
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    }
};
