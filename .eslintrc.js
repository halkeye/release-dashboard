module.exports = {
    "parser": "babel-eslint",
    "extends": ["standard", "plugin:react/recommended"],
    "settings": {
        "react": {
            "version": "16.0"
        }
    },
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
