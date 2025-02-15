const log = console.log;
var gdata;
var ndata;
$.get("./js/treedata.json", data => {
	gdata = data;
	createJstree(data);
	ndata = convert(data);
	
	//log( search(ndata, 392) );
	//log( c );
});

var c = 0;

function convert(arr) {
	const res = {};
	const len = arr.length;
	for (let i=0; i<len; i+=1) {
		const obj = arr[i];
		res[obj.id] = obj;
	}
	return res;
}

function findPathById(obj, id, path=[]) {
	let target = obj[id];
	path.push(target.text);
	if (target.parent === "#") {
		return path.reverse().join("/");
	} else {
		return findPathById(obj, target.parent, path)
	}
}

function search(obj, str) {
	let res = [];
	Object.keys(obj).forEach(k => {
		const prop = obj[k];
		if ( prop.text.includes(str) ) {
			res.push(prop.id);
		}
	});
	return res;
}

function extname(str) {
	// return str.split('.').pop();
	return str.slice( (Math.max(0, str.lastIndexOf(".")) || Infinity) + 1 );
}

function template(content, url) {
	const ext = extname(url);
	const lines = ext !== "txt";
	let html = "";
	
	if (ext === "png" || ext === "jpg" || ext === "gif") {
		html = `<img src="${url}"/>`;
	} else {
		html =  `
		<pre ${lines ? 'class="line-numbers"' : ''}>
			<code class="language-${ext}">${content}</code>
		</pre>`;
	}
	return html;
}
function getFileAndRender(url) {
	const ext = extname(url);
	$.ajax({
		url,
		dataType: "text",
		method: "GET"
	})
	.done(data => {
		const html = template(data, url);
		$("#content").html(html);
		Prism.highlightAll();
	});
}

const awesomplete = new Awesomplete("#myInput", {
	minChars: 2,
	maxItems: 20,
	list: [],
	item: function (text, input) {
		let img = text.includes(".") ? extname(text) : "dir";
		let highlighted = text.replace(new RegExp(input, "ig"), `<mark>${input}</mark>`);
		return $.parseHTML(`<li><img src="images/${img}.png" class="ico" />${highlighted}</li>`)[0];
	}
});

$("#myInput").on("input", function (e) {
	const inpText = $(e.target).val();
	if (inpText.length > 2) {
		var arr = search(ndata, inpText);
		awesomplete.list = arr.map(i => findPathById(ndata, i));
	}
});

$("#myInput").on("awesomplete-select", function (e) {
	const item = e.originalEvent.text.value;
	const ext = extname(item);
	const url = "./data/" + item;
	
	history.pushState(item, ext, "#!"+item);
	getFileAndRender(url);
});

$("#myInput").on("awesomplete-selectcomplete", function (e) {
	
});



window.addEventListener('popstate', function (e) {
	console.log("onpopstate fired", e);
});

/* window.onpopstate = function(e) {
  
}; */

/* window.onhashchange = function (e) {
	
}; */

window.addEventListener('hashchange', function (e) {
	console.log("onhashchange fired", e);
});

function createJstree(data) {
	const o = f => ({ "icon": f ? `images/${f}.png` : "jstree-file", "valid_children": [] });
	$('#tree-container').jstree({
		core: {
			data: data
		},
		// jstree-file
		types: {
			"": o(),
			"txt":  o("txt"),
			"js":   o("js"),
			"jsx":  o("js"),
			"ts":   o("ts"),
			"vue":  o("vue"),
			"html": o("html"),
			"htm":  o("html"),
			"md":   o("md"),
			"css":  o("css"),
			"scss": o("scss"),
			"php":  o("php"),
			"c":    o("c"),
			"rb":   o("rb"),
			"sql":  o("sql"),
			"bat":  o("bat"),
			"ps1":  o("ps1"),
			"json": o("json"),
			"xml":  o("xml"),
			"conf": o("conf"), //
			"yaml": o("yml"),
			"yml":  o("yml"),
			"ai":   o("ai"),
			"png":  o("png"),
			"jpg":  o("jpg"),
			"gif":  o("gif"),
			"ico":  o("ico"),
			"lnk":  o("lnk"),
			"pdf":  o("pdf"),
			"xls":  o("xlsx"),
			"xlsx": o("xlsx"),
			"xlsm": o("xlsx"),
			"csv":  o("csv"),
			"doc":  o("docx"),
			"docx": o("docx"),
			"pptx": o("pptx"),
			"ppt":  o("pptx"),
			"zip":  o("zip"),
			"rar":  o("zip"),
			"7zip": o("zip"),
			"handlebars": o("handlebars"),
			"hbs": o("handlebars")
		},
		plugins: ["types"]
	});
	
	$('#tree-container').on("changed.jstree", function (e, data) {
		if (data.node.children.length === 0) {
			const path = findPathById(ndata, +data.node.id);
			getFileAndRender("./data/"+path);
		}
	});
	$('#tree-container').on("open_node.jstree", function (e, data) {
		//debugger
	});
}
/*
.browserslistrc
.bowerrc
.jshintrc
.env
.mwb
.bak
.jade
.rtlsrc
.babelrc
.sublime-color-scheme
.DS_Store
.db
.conf
.vpp
.rb
FileWithNoExtension
*/