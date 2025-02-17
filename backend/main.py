from flask import Flask, render_template

app = Flask(__name__, static_folder="static")

@app.route("/")
def index():
    print(app.template_folder)
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)