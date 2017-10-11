evtManage.js
一個簡單的管理事件綁定的class
ex evtManage.bind("click", "custom name for this event", evevt function)


lan.js
內定全域變數 lang
藉由setLang去設定 想要使用的編碼
source 中以json格式存放使用到字串
目前"zh-tw"內所有的 term 都有使用到 如需更改語言 請確保所有的term(如load, save..)都有出現在新的語系中
getString 輸入term 取得目前語系對應的字串


main.js
generatorLoadingStatus - 產生loading svg
openLoading - 開啟loading畫面
closeLoading - 關閉loading畫面
cloneObject - data system 中使用到的function 複製Object 
jqDOM - 借助jquery 產生簡單的DOM元素
ctrl - 其中的data存放dataSystem
notUndefined - 判斷是否undefined
page_init - page loader init



nav-controller.js
navController(lan, dc) - input lan 為在lang.js宣告之全域變數, dataSystem 為data system
	selectInit - 初始化select元件
	getNav, getNavItem - 配合html中nav的label屬性取DOM
	renderTemplate - 繪製nav中 Template list的內值
	renderRecordList - 繪製nav中 Record list的內值
	loadData - 呼叫Data system的ajax去取得 Template Record list 以及 template對應的class list, (批次取得)
	init - 初始化 list 


orgChart.js 第二畫面(preview)所使用的元件
orgchart_global 全域變數 輔助click之判定
orgChart (con, main) - con 為 繪圖之區域(DOM), main為 data system 底下之 preview controller 下的 preview_view
	svgEl - 新增SVG 元件
	buildTree - 產生樹節點 -> 建立傅子兄弟關係(setRelation) -> 計算樹高度(countDegrees) -> 依照葉節點再次調整樹高(adjustDegrees) -> 畫樹
	getLeaf - 取得葉節點
	adjustDegrees - 由下而上重新標定樹高 ( 部分樹根之degree不再是0 )
	countDegrees - 由上而下標定樹高
	renderTree - 根據degree(y軸) 放進不同陣列 然後畫圖
	nodeEvent - 綁定節點的點擊事件 並判斷是click event 或 dblclick event
	doubleClick - 呼叫view的termPanel
	singleClick - 圖上標示該點
	getSibling - 取得兄弟
	renderNode - 畫點 並標示線段
	computRectPostion - 計算節點位置
	rectGen - 產生圖上之節點(方塊) 綁定Event
	setRelation - 建立父子兄弟關係
	getNode - 依照id取得節點資料
	nodeGen - 根據外部資料產生節點資料
	initial - 產生SVG 元件 設定Zoom drag事件	 
	zoom - 放大事件
	getTranform - 取得svg內DOM元件的Transform
	setTranform - 設定svg內DOM元件的Transform
	computeLine - 計算兄弟節點的線段 
	computeParentLine - 計算父子節點的線段
	addLink - 判斷二節點關係(getRelationship) 加入不同的線段於svg
	lineUpdate - 未使用
	getRelationship - 判斷節點關係
	unActiveRects - 取消focus 圖上節點
	clearSiblingLine - 清理所有屬於兄弟節點關係的線段
	getOriDataById - 依照id取得原始之輸入資料節點
	svgDraggable - 未使用
	updateView - 輔助zoom backgroundDrag 功能
	backgroundDrag - 畫面拖曳功能
	reset - 呼叫 clear
	clear - 清除方塊與線段
	draw - 輸入資料  呼叫clear 建立樹結構(繪圖)



v-orgChart.js 第三畫面(result)所使用的元件
v_orgchart_global 全域變數 輔助click之判定
vOrgChart (con, main) - con 為 繪圖之區域(DOM), main為 data system 底下之 result controller 下的 preview_view
	svgEl - 新增SVG 元件
	nodeEvent - 綁定節點的點擊事件 並判斷是click event 或 dblclick event
	singleClick - 圖上標示該點 呼叫 main中showRecord 以供使用者編輯
	renderNode - 畫點 並標示線段
	computRectPostion - 計算節點位置
	rectGen - 產生圖上之節點(方塊)
	initial - 產生SVG 元件 設定Zoom drag事件	
	zoom - 放大事件
	getTranform - 取得svg內DOM元件的Transform
	setTranform - 設定svg內DOM元件的Transform
	computeParentLine - 計算父子節點的線段
	addLink - 加入父子的線段於svg
	unActiveRects - 取消focus 圖上節點
	adjustDegrees - 由下而上重新標定樹高 ( 部分樹根之degree不再是0 )
	countDegrees - 由上而下標定樹高
	renderTree - 根據degree(y軸) 放進不同陣列 然後畫圖
	svgDraggable - 未使用
	updateView - 輔助zoom backgroundDrag 功能
	backgroundDrag - 畫面拖曳功能
	getNode - 依照id取得節點資料
	nodeGen - 根據外部資料產生節點資料
	reset - 呼叫 clear
	clear - 清除方塊與線段
	drawClass - 繪製class 節點 並叫叫 drawChild
	drawChild - 繪製已經分類的節點 並綁定事件
	drawNc  - 繪製尚未分類的節點 並綁定事件
	draw - 呼叫clear -> 先drawClass 在畫 drawNc



dataSystem.js 
	dataSystem ( book ) - book為對應的DOM 用來給予system操作
	data - {
		version : 所用template 及 record
		curRecord : 目前working group 
		controller : 包含 groupController previewController resultController
		views : 由contronller 新增所操作的 DOM元素
		class : 目前template的分類
		record : 目前record的working group存放
		group : 目前Template的GROUP
		label : book底下的不同分頁
		evt : 使用evtManage管理事件
		textDAta : 紀錄目前working group 的暫存資料
		ajax : 存放ajax function之容器
	}

	data.ajax{
		updateRecord - 更新 working group 
		getKeywordAssoc - 取得字串的平層詞 上層詞 下層詞
		mergeWorkingGroup - 合併working group
		decompositeWorkingGroup - 分解working group
		getGroupSentence - 取得單一template group資料 n為句子數量 st為起始
		getTemplateList - 取得template list
		getRecordList - 取得record list
		getClass - 取得 目前template的class list
		loadRecord - 讀取當前record之working group offset為資料片段
		loadGroups - 取得template group資料 n為句子數量 offset為資料片段
	}

	updateRecord - 由底下之controller呼叫 並接收參數 執行ajax 更新 working group
	initial - 初始化 controller 及 分頁標籤之事件
	clear - 初始化 textData curRecord
	start - 此system最初直接第一分頁的start
	getData - 取得 system data
	next - 由底下之controller呼叫 尋找下一分頁及對應controller 執行controller.start()
	back - 由底下之controller呼叫 尋找上一分頁及對應controller 執行controller.start()
	showPage - 顯示分頁
	getPageController - 輔助取得分頁controller
	getLabels - 取得book的標籤(index)
	isCombinedRecord - 簡直 working group是否為合併群組
	getChildGroup - 傳回working group對應的groups
	getGroupById - 由group id 取得group
	getGroupKeywords - 由working group id 取得對應的groups之關鍵字
	getKeywordsInGroups - 傳遞groups集合 取得其中之關鍵字集合
	getRecordById  - 由  working group id 取得 working group
	getRecordByDBId - 由  working group id 取得 working group在資料庫的id
	mergeChildKeyword - 傳遞groups集合 取得其中之關鍵字集合 (近同 getKeywordsInGroups)
	mergeChildsentence - 傳遞groups集合 取得其中之句子集合 
	setRecord - book設定 Record 資訊
	setTemplate - book設定 Template 資訊
	getRecord - book取得 Record 資訊
	getTemplate - book取得 Template 資訊
	deleteRecordByDBId - 藉由 working group db_id 刪除目前system 中的 working group
	combineGroup - 呼叫 mergeWorkingGroup合併 working group 並修改 目前system中的 working group資料
	decomposeGroup - 呼叫 decompositeWorkingGroup 分離 working group 並修改 目前system中的 working group資料
	getDBIdByRecordId - 就由 working group ID 取得 該working group在DB中的ID
	output - 由底下之controller呼叫 輸出csv


//////
controller 附屬於data system 下協助管理每一個分頁
分頁離開時會呼叫lock鎖住當前頁面離開後不該被更動的部分
當再次由start進入時解開
start 時會根據當前頁面 鎖住部分標籤
//////


group_controller.js
	groupController(main, data, book, order) - main為data system, data為系統目前資料, book為主要的容器, order為此controller於系統中的序列
	initial - 初始化 底下的view 並且預先鎖住畫面 等待start
	tagRender - 計算keyword區塊所需呈現的關鍵字 並傳送給keyword區塊進行呈現
	decomposeGroup - 通知system 分解 working group 並修改畫面
	keywordFilter - 通知keyword 區塊修改畫面
	groupFilter - 藉由 getFilterGroup 通知 group區塊修改畫面  並呼叫 groupSelect
	groupSelect - 藉由目前group 選擇數量 通知底下的view 修改畫面
	isCombinedRecord - 由system判斷 working group 是否為合併群組
	combineGroup - 合併working group 並修改呈現畫面
	getRenderGroup - 回傳group區塊需要呈現的group 
	getChildGroup - 傳遞 working group id 呼叫system  得到 group 集合
	mergeChildKeyword - 傳遞groups 呼叫system  得到 keyword集合
	mergeChildsentence - 傳遞groups 呼叫system  得到 句子集合
	getOrder - 取得此controller之序列
	getActiveTag - 取得目前選擇的 tag(keyword)
	getActiveGroup - 取得目前有選擇的working group之ID
	getView - 取得此controller之主要容器
	getGroupById - 傳遞 group ID呼叫system 取得  group
	getRecordById - 傳遞 working group ID呼叫system 取得 working group
	getRecordByDBId - 傳遞 working group DB ID呼叫system 取得 working group
	getFilterGroup - 取得此畫面中需要被隱藏的 working group
	getGroupKeywords - 傳遞id呼叫system 取得關鍵字
	getGroups - 傳回系統資料
	getGroupSentence - 呼叫 system 的ajax 取得句子
	nextPage - 進入下一個controller ( preview) 預先將 textData.label 清空

group_viewer_view.js
	filter - 清空畫面 並依照輸入的內容判定 最終顯示需要的內容
	loadTopArea - 畫面上方區塊(working group list)載入
	loadContArea - 畫面主要區塊(working group content list)載入
	loadMore - 檢查system data對所選定的group載入更多句子
	createGroupEntry - 根據working group id 並創建主要區塊
	decomposeEvent - 選取上方區塊(working group list)之tag 分解該working group

group_group_view.js
	groupSelect - group選擇之事件 並呼叫controller 更新畫面
	filter -  主要由controller  呈現畫面用
	groupRender - 給予working group 資料 呈現畫面上的group entry
	addGroup - 將產生的entry 加入 group list
	genGroup - 產生畫面上的group entry
	combinedCheck - 判斷資料是否為合併群組
	groupActive - 使單一group 為active(點選)狀態

group_keyword_view.js
	keyInEvent - 畫面之輸入欄位事件 通知controller 篩選顯示的關鍵字 
	tagSelect - 關鍵字點選的事件 呼叫controller進行判斷
	filter - 被controller 通知 更新顯示的tag(keyword)
	tagRender - 關鍵字 entry 的產生 並綁定 tagSelect



preview_controller.js
	previewController - main為data system, data為系統目前資料, book為主要的容器, order為此controller於系統中的序列

	initial - 初始化 底下的view 並且預先鎖住畫面 等待start
	start - 此處會先讀取所需的關鍵字的資料( recordKeywordLoad - getKeywordAssoc )
	getCurrentGroups - 取得目前working group之group
	textDataCheck - 繪圖前確定資料是否完全足夠
	recordKeywordLoad - 取得未持有的詞彙資料(getKeywordAssoc)
	loadUnknowText - 接收set 分辨出未持有的詞彙資料 並呼叫ajax.getKeywordAssoc
	tagEvent - keyword區塊click時 繪圖
	keywordListRefresh - 根據textData.label 標示出keyword區塊的關鍵字是否active
	termPanelRemove - 底層 preview 中 termpanel 移除 資料時呼叫 更新 textData.label
	draw - 先讀取未持有資料後 讓preview view 畫圖


preview_keyword_view.js
	render - headTag + tagRender
	headTag - 顯示目前working group
	tagRender - 關鍵字 entry 的產生 並綁定 tagEvent
	tagEvent - 呼叫controller tagEvent 更新關係圖
	getActivityTag - 取得目前點選的tag	
	fresh - 依照輸入資料更新tag list的點選狀態

preview_preview_view.js
	initial - 此處有新建graph(orgChart)或是reset的動作
	convertList - 轉換目前textData資料  給予繪圖所需
	drawChart - convertList + orgChart.draw()
	termPanelRemove - 由termPanel畫面移除顯示某一關鍵字
	termPanelCancel - termPanel取消不更動
	termPanelApply - 更動選定的字詞 重新繪圖
	termPanel - 擷取termPanel畫面所需資料後  由renderTermPanel呈現
	renderTermPanel - 呈現termPanel畫面

preview_viewer_view.js
	程式內容為group_viewer_view之簡化變動

result_controller.js
	resultController - main為data system, data為系統目前資料, book為主要的容器, order為此controller於系統中的序列
	initial - 初始化 底下的view 並且預先鎖住畫面 等待start
	output - 輸出資料
	start - 此處會先做按鈕的filter
	draw - 根據目前data.record 中存放的working group 畫圖
	save - 更新選定之working group
	controllerFilter - 判定是否還有 working group未被分類 以決定是否開啟 繼續之按鈕


result_viewer_view.js

	dataConvert - 轉換目前working group 資料  給予繪圖所需
	drawChart - dataConvert + v-orgChart.draw()

result_viewer_view.js
	render - 由controller 呼叫 負責顯示選定的working group資料
	saveEvent - update  working group data
	showRecord - 由v-orgChart呼叫 通知controller 顯示working group資料
	hideRecord - 由v-orgChart呼叫 通知controller 清空顯示working group資料的區塊


// common setting
_controller_ctrl_view.js
	__view(main) - main上層controller
	initial - 初始化按鈕 基本分為 next back，其他的按鈕包含output combine 會呼叫上層controller 執行對應事件
	lock - 呼叫時會鎖住ctrl區塊在離開畫面時不該更改的元件
	show - 解開鎖住的元件
	filter - 部分controller 會需要判斷甚麼情況下按鈕會需要被單獨鎖住
