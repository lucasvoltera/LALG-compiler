export function checkIdentifier(compiledCodePosition, syntaxErrors, semanticErrors, variablesTable, variableType, generatedCode, dataTable) {
	if (compiledCodePosition.token !== 'IDENTIFIER') {
		syntaxErrors.push({
			token: compiledCodePosition.token,
			error: "DEVERIA SER UM IDENTIFICADOR",
			line: compiledCodePosition.line,
			column: compiledCodePosition.column
		});

	}
	else {
		if (variablesTable) {
			if (variablesTable.find(identify => { identify.value === compiledCodePosition.value })) {
				semanticErrors.push({
					token: compiledCodePosition.token,
					error: "JA EXISTE UM IDENTIFICADOR COM ESSE NOME",
					line: compiledCodePosition.line,
					column: compiledCodePosition.column,
				});
			} else {
				variablesTable.push({
					...compiledCodePosition,
					type: variableType,
				});

				// generatedCode.push({
				// 	line: generatedCode.length,
				// 	code: "AMEM 1"
				// });

				// dataTable.push({
				// 	adress: dataTable.length,
				// 	value: compiledCodePosition.value
				// });
			} 
		} else {
			variablesTable.push({
				...compiledCodePosition,
				type: variableType,
			});

			// generatedCode.push({
      //   line: generatedCode.length,
      //   code: "AMEM 1"
      // });

			// dataTable.push({
			// 	adress: dataTable.length,
			// 	value: compiledCodePosition.value
			// });
		}
	}

}