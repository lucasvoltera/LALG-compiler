import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ToastContainer, toast } from 'react-toastify';
import lexr from 'lexr';

import { FiPlay, FiUpload } from 'react-icons/fi';

import './global.scss';
import 'react-toastify/dist/ReactToastify.css';

// IMPORT ALL TOKENS, KEYWORDS, ERRORS, TYPES
import { dictionary, tokens, keywords, errors, types } from './utils/Lexical';


function App() {
  // "program correto;\n int a, b, c;\n boolean d, e, f;\n int a, b, c;\n procedure proc(var a1 : int);\n int a, b, c;\n boolean d, e, f;\n begin\n a:=1;\n if (a<1) then\n a:=12;\n end\n begin\n a:=2;\n b:=10;\n c:=11;\n a:=b+c;\n d:=true;\n e:=false;\n f:=true;\n read(a);\n write(b);\n if (d) then\n begin\n a:=20;\n b:=10*c;\n c:=a/b;\n end\n while (a>1) do\n begin\n if (b>10) then\n b:=2;\n a:=a-1;\n end\n end.\n"
  const [editorText, setEditorText] = useState("program correto;\n int a, b, c;\n boolean d, e, f;\n begin\n a:=2;\n b:=10;\n c:=11;\n a:=b+c;\n d:=true;\n e:=false;\n f:=true;\n read(a);\n write(b);\n if (d) then\n begin\n a:=20;\n b:=10*c;\n c:=a/b;\n end\n while (a>1) do\n begin\n if (b>10) then\n b:=2;\n a:=a-1;\n end\n end.\n");
  const [compiledCode, setCompiledCode] = useState([]);
  const [isAsideVisible, setIsAsideVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("lexical");

  // INITIALIZES LEXR
  let tokenizer = new lexr.Tokenizer("");

  // ADD RULES
  tokenizer.addTokenSet(keywords);
  tokenizer.addTokenSet(types);
  tokenizer.addTokenSet(tokens);
  tokenizer.addTokenSet(errors);

  tokenizer.addIgnoreSet(["WHITESPACE"]);

  function handleSubmit() {
    let editorTextLines = editorText.split("\n");
    let compiledCodeLines = [];

    editorTextLines.forEach((line, lineIndex) => {
      const response = tokenizer.tokenize(line);

      response.forEach((column, columnIndex) => {
        response[columnIndex] = { ...column, line: lineIndex + 1, column: columnIndex + 1 };
      });
      
      Array.prototype.push.apply(compiledCodeLines, response);
    });

    //updateCompiledCode(compiledCodeLines);
    setCompiledCode(compiledCodeLines);
  }

  function handleEditorChange(value, event) {
    setEditorText(value);
  }

  async function handleUpload(event) {
    event.preventDefault();

    const exampleFileReader = new FileReader();
    exampleFileReader.onload = async (event) => { 
      setEditorText(event.target.result);
    };
    exampleFileReader.readAsText(event.target.files[0]);
  }
  
  return (
    <div className="container">
      <section className="code-editor">
        <div className="actions">
          <div className="editor-actions">
            <button type="button" onClick={handleSubmit}>
              <FiPlay size={16} />
              COMPILE
            </button>

            <label htmlFor="upload" className="upload" >
              <FiUpload size={16} />
              UPLOAD FILE
            </label>
            <input 
              id="upload" 
              type="file" 
              onChange={(event) => handleUpload(event)} 
            />
          </div>
        </div>

        <Editor 
          height="100%"
          width="100%"
          value={editorText}
          theme="vs-light" // mudar para vs-light ou
          onChange={handleEditorChange}
          options={{ fontSize: "16px" }}
        />
      </section>

      <aside className={`aside-container ${(isAsideVisible ? "visible" : "invisible")}`}>
        <div className="aside-content">

          <div className={activeTab === "lexical" ? "active-table lexical-table" : "inactive-table"}>
            <table>
              <thead>
                <tr>
                  <th>LEXEME</th>
                  <th>TOKEN</th>
                  <th>ROW</th>
                  <th>COLUMN</th>
                </tr>
              </thead>
              <tbody>
                {compiledCode.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.value}</td>
                      <td>{dictionary[data.token]}</td>
                      <td>{data.line}</td>
                      <td>{data.column}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </aside>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ backgroundColor: "#1E1E1E", color: "#D4D4D4" }}
        limit={1}
      />
    </div>
  )
}

export default App;
