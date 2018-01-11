const app = (() => {
	let $button;
	let $fileDrop;
	let $fileDropText;

	return {
		init() {
			$button = $('button')[0];
			$fileDrop = $('.file-drop');
			$fileDropText = $('.file-drop-text');

			$fileDrop
				.on('drag dragstart dragend dragover dragenter dragleave drop', e => {
					e.preventDefault();
					e.stopPropagation();
					return;
				})
				.on('dragover dragenter', e => {
					$(e.target).addClass('file-drop-active');
				})
				// .on('dragover', e => {
				// 	e.originalEvent.dataTransfer.dropEffect = 'copy';
				// })
				.on('dragleave dragend drop', e => {
					$(e.target).removeClass('file-drop-active');
				})
				.on('drop', e => {
					console.log('drop');

					const dataTransfer = e.originalEvent.dataTransfer;
					const files = dataTransfer.files;
					const file = files[0];
					const reader = new FileReader();

					reader.readAsText(file);

					reader.addEventListener('loadend', e => {
						const data = e.currentTarget.result;

						// parse json
						let rows;
						try {
							rows = JSON.parse(data);
						} catch (e) {
							alert('Sorry, that JSON could not be parsed. Please try another file.');
							return;
						}

						// json must be an array of rows.
						if (!Array.isArray(rows)) {
							alert('The JSON file you provided is not in row format. Please try another file.');
							return;
						}

						if (!rows.length) {
							alert('The JSON file you provided is empty. Please try another file.');
							return;
						}

						// check for nested data
						for (let row of rows) {
							const vals = Object.values(row);
							for (let val of vals) {
								// check for object
								if (typeof val === 'object') {
									alert('Sorry, the JSON file you provided contains nested data which cannot be converted to CSV. Please try another file.');
								}
							}
						}

						// write out
						let csvRows = [];

						// header
						// TODO make this in the same order as the json file
						const firstRow = rows[0];
						const cols = Object.keys(firstRow);
						csvRows.push(cols);
						// rows.shift();

						for (let row of rows) {
							const vals = cols.map(col => row[col]);
							csvRows.push(vals);
						}

						let fileString = '';

						for (let csvRow of csvRows) {
							fileString += `${csvRow.join(',')}\n`;
						}

						console.log(fileString);

						const link = document.createElement('a');
				    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileString));
				    // TODO use original file name
				    link.setAttribute('download', 'json-to-csv.csv');
				    link.click();
					});

					// e.preventDefault();
					// e.stopPropagation();
					// $(e.target).removeClass('file-drop-drag');

					// console.log(e.originalEvent.dataTransfer.getData('text'));

					// this.handleFileDrop(e);

					// return;
				});
		},

		// handleFileDrop(e) {
		// 	console.log('did drag file', e.originalEvent.dataTransfer);
		// 	const dataTransfer = e.originalEvent.dataTransfer;
		// 	const file = (dataTransfer.files || [])[0];

		// 	if (!file) {
		// 		alert('An error occurred handling that file. Please try again.');
		// 		return;
		// 	}

		// 	// update file drop
		// 	$fileDrop.addClass('file-drop-active');
		// 	$fileDropText.text(`Uploaded: ${file.name}`);

		// 	const data = dataTransfer.getData('text/plain');
		// 	console.log('data', data);
		// },
	};
})();

$(() => {
	app.init();
});