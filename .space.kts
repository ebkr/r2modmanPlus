/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("Run npm test and publish") {
    container(displayName = "Run tests", image = "node:14-alpine") {
        env["REGISTRY"] = "https://registry.npmjs.org"
        shellScript {
            interpreter = "/bin/sh"
            content = """
                echo Install npm dependencies...
                npm install
                echo Run tests...
                npm run test
            """
        }
    }
}
