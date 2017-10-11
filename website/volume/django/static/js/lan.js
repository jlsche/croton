function lan_con() {
	var curLang = "zh-cn";
	var source = {
		"zh-cn" : {
			"test" : "测试",
			"welcome" : "欢迎",
			"none" : "无资料",
			"load" : "读取",
			"save" : "保存",
			"sentence" : "评论",
			"id-num" : "编号",
			"group" : "群组",
			"next" : "下一步",
			"back" : "返回",
			"more" : "more",
			"loading" : "载入中",
			"group-page" : "群组页面",
			"keyword-page" : "关键字预览页面",
			"class-page" : "分类页面",
			"loading-text" : "loading",
			"apply" : "确认",
			"cancel" :"取消",
			"term-tip" : "目前显示之项目与所选择之项会交互影响",
			"top-term" : "上层词",
			"mid-term" : "平层词",
			"bot-term" : "下层词",
			"continue" : "继续",
			"output" : "输出",
			"group-data" : "群组资料",
			"group-list" : "群组列表",
			"label" : "标签",
			"class" : "类别",
			"save" : "保存",
			
			"search" : "搜寻",
			"view-all":"显示全部",
			"output-text" : "导出",
			"output-rawdata" : "导出RawData",
			"output-sentence" : "导出典型评论",
			"set": "组别",
			"set-num": "组数",
			"typical-sentence" : "典型评论",
			"sentence-num":"评论数",
			"id" : "ID",
			"select" : "选择",
			"create" : "创建",
			"combine" : "合并",
			"split" : "拆分",
			"remove" : "删除",
			"edit-name" : "更名",
			"term01" : "共",
			"term02" : "条",
			"term03" : "是否确定将多个群组指派下方显示标签?",
			"term04":"请输入标签名称(10字以内)",
			"term05" : "更名，请输入标签名称(10字以内)",
			"term06":"是否将以下标签合并?",
			"term07":"要拆分的标签 : ",
			"term08":"请选择需要拆分的观点：",
			"term09":"是否确定移除下方显示标签?",
			"term10":"组",

			"close" : "关闭",
			"create-label":"创建标签",
			"remove-label":"移除标签",
			"splite-label":"标签拆分",
			"combine-label":"标签合并",
			"rename-label":"标签更名",
			"error":"错误发生",
			"filter-label" :"标签筛选",
			"label-group" : "群组标签",
			"select-all" : "全选",
			"no-label" :"未分类",

			"edit-fail" : "更改失败",
			"combine-fail" : "合并失败",
			"name-exist" :"已存在重复名称",
			"str-len-wrong" :"字串长度不符规格",
			"create-fail":"标签创建失败",
			"rename-fail" :"更名失败",
			"split-fail":"拆分失败",
			"remove-fail":"移除失败",
			"search-fail":"搜寻失败",

			"label-fail" :"标签失败",

			"output-row00" : "标签ID,观点,原始语句\n",
			"output-term00":"未分类(系统产生)",
			"output-name00" : "明细结果_",

			"output-row01" : "标签ID,观点标签,评论条数\n",
			"output-term01":"未分类(系统产生)",
			"output-name05" : "观点彙总_",

			"output-row02" : "组别,典型评论,评论数,标签\n",
			"output-row02a" : "典型评论,原始语料明细\n",
			"output-term02":"未分类(系统产生)",
			"output-term02a":"未被聚类",
			"output-name02" : "典型评论_",
			"output-name02a" : "原始语料明细_",

			"output-name01": "观点标签",

		}
	}
	this.setLang = function(lang){
		curLang = lang;
		console.log( " current lang is "+ curLang)
	}
	this.getString = function(term){
		return source[curLang][term];
	}
	
	this.rewrite = function(){
		var e = $("*[data-lanCont]");
		var ctrl = this;
		e.each(function(ind){
			var cur = e.eq(ind);
			var term = cur.attr("data-lanCont");
			if ( term.length > 0 ){
				var text = ctrl.getString(term);
				//console.log ( "load the term : " + term);
				if ( typeof (text) != "undefined" ){
					cur.html( text )
				}
			}
		})
	}


}

var lang = new lan_con()
