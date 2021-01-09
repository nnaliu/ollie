const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const admin = require('firebase-admin');

const OpenAI = require('openai-api');
const OPEN_AI_API_KEY = functions.config().gpt3.key;
const openai = new OpenAI(OPEN_AI_API_KEY);
const languagetool = require('languagetool-api');

var languagetool_params = {
  language: 'en-US',
  text: '',
  disabledRules: ['UPPERCASE_SENTENCE_START', 'EN_QUOTES', 'COMMA_PARENTHESIS_WHITESPACE', 'DATE_WEEKDAY_WITHOUT_YEAR']
    // Rule list: https://community.languagetool.org/rule/list
};

exports.gpt3Gateway = functions.https.onCall((data, context) => {
	const prompt = data.prompt;
	const conversation = data.conversation;

	return (async () => {
		var response, result;
		var safety = 2;
		do {
			response = await openai.complete({
				engine: 'babbage', // Temporarily replaced davinci with instruct-davinci-beta
				prompt: prompt + '\n' + conversation.join('\n'),
				maxTokens: 50,
				temperature: 0.7,
				topP: 1,
				presence_penalty: 0.3,
				frequency_penalty: 0.3,
				best_of: 1,
				n: 1,
				stream: false,
				stop: ['User', 'Ollie:']
			});
			result = response.data.choices[0].text;
			safety = await openai.complete({
				engine: 'content-filter-alpha-c4',
				prompt: result,
				max_tokens: 1,
				temperature: 0.0,
				top_p: 0
			})
		} while (safety > 0);

		// Remove surrounding quotes and whitespace
		return { text: result.replace(/^["'](.+(?=["']$))["']$/,'$1').replace(/^\s+|\s+$/gm,'') };
	})();
});

// Good example for checking function: 'It is a awsome weekand.'
exports.grammarCheckGateway = functions.https.onCall((data, context) => {
	languagetool_params.text = data.text;

	function languageToolAsync(params) {
		return new Promise(function(resolve, reject) {
			languagetool.check(params, function(err, res) {
				if (err) {console.log(err);}
				else { resolve(res); }
			});
		});
	}

	return (async () => {
		var response = await languageToolAsync(languagetool_params);
		return response.matches;
	})();
});

exports.translateGateway = functions.https.onCall((data, context) => {
	const language = data.language;
	const prompt = 'Translate from ' + language + ' to English.\n###\nInput: My tía is in el baño.\nOutput: My aunt is in the bathroom.\n###\nInput: Querio eat the tarta.\nOutput: I want to eat the pie.\n###\n'
	const text = data.text;

	return (async () => {
		var response, result;
		var safety = 2;
		do {
			response = await openai.complete({
				engine: 'babbage', // Temporarily replaced babbage with instruct-davinci-beta
				prompt: prompt + '\nInput: ' + text + '\nOutput:',
				maxTokens: 64,
				temperature: 0.1,
				topP: 1,
				presence_penalty: 0,
				frequency_penalty: 0,
				best_of: 1,
				n: 1,
				stream: false,
				stop: ['#', 'Input']
			});
			result = response.data.choices[0].text;
			safety = await openai.complete({
				engine: 'content-filter-alpha-c4',
				prompt: result,
				max_tokens: 1,
				temperature: 0.0,
				top_p: 0
			})
		} while (safety > 0);
		return result.trim();
	})();
});