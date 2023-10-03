import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ToastContainer, toast } from 'react-toastify';
import lexr from 'lexr';

import { FiChevronsLeft, FiChevronsRight, FiGithub, FiPlay, FiUpload } from 'react-icons/fi';

import './global.scss';
import 'react-toastify/dist/ReactToastify.css';

// IMPORT ALL TOKENS, KEYWORDS, ERRORS, TYPES
import { dictionary, tokens, keywords, errors, types } from './utils';
import { identifyFunction } from './utils/Syntax/functions';

function App() {
  const [editorText, setEditorText] = useState("int a;\nint b,");
  const [compiled, setCompiled] = useState([]);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [isAsideVisible, setIsAsideVisible] = useState(true);

  // INITIALIZES LEXR
  let tokenizer = new lexr.Tokenizer("");

  // ADD RULES
  tokenizer.addTokenSet(keywords);
  tokenizer.addTokenSet(types);
  tokenizer.addTokenSet(tokens);
  tokenizer.addTokenSet(errors);

  tokenizer.addIgnoreSet(["WHITESPACE"]);

  function handleSubmit() {
    // ARRUMAR
    getLexical();
  }

  function getLexical() {
    let editorTextLines = editorText.split("\r\n");
    let compiledLines = [];
    let lineErrors = [];

    let identifiers = [];

    editorTextLines.forEach((line, lineIndex) => {
      const response = tokenizer.tokenize(line);
      const errorList = identifyFunction(response, lineIndex + 1, identifiers);

      if (errorList.length) {
        Array.prototype.push.apply(lineErrors, errorList);
      }

      response.forEach((column, columnIndex) => {
        response[columnIndex] = { ...response[columnIndex], line: lineIndex + 1, column: columnIndex + 1 };
      });
      
      Array.prototype.push.apply(compiledLines, response);
    });

    setCompiled(compiledLines);
    setSyntaxErrors(lineErrors);
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
              COMPILAR
            </button>

            <label htmlFor="upload" className="upload" >
              UPLOAD
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
          width="45%"
          value={editorText}
          theme="vs-light"
          onChange={handleEditorChange}
          options={{ fontSize: "16px" }}
        />
      </section>

      <aside className={`tokens-table ${(isAsideVisible ? "visible" : "invisible")}`}>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>LEXEMA</th>
                <th>TOKEN</th>
                <th>LINHA</th>
                <th>COLUNA</th>
              </tr>
            </thead>
            <tbody>
              {compiled.map((data, index) => {
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
              SYNTAX ERRORS
              <table>
                <thead>
                  <tr>
                    <th>ERRO</th>
                    <th>LINHA</th>
                    <th>COLUNA</th>
                  </tr>
                </thead>
                <tbody>
                  {syntaxErrors.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{data.error}</td>
                        <td>{data.line}</td>
                        <td>{data.column}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
