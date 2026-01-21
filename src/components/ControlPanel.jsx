import React, { useState, useEffect } from 'react';

const ControlPanel = ({ 
    settings, 
    setSettings, 
    onFileUpload, 
    onLoadData, 
    onStartDraft, 
    onNextPick, 
    onManualPick, 
    onUndo,
    onReset, 
    onClearCache,
    onDownloadTemplate,
    onExport,
    draftStatus,
    isDataLoaded,
    darkMode,
    toggleDarkMode,
    hasFile,
    onPreview,
    swapSource,
    isRichMode,
    toggleRichMode,
    exportWithScores,
    setExportWithScores,
    language,
    setLanguage
}) => {
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    // 當資料載入完成 (準備開始選秀) 時，自動收合面板以騰出空間
    useEffect(() => {
        if (isDataLoaded) {
            setIsCollapsed(true);
        }
    }, [isDataLoaded]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    // 根據數值有效性回傳樣式
    const getInputStyle = (name, value) => {
        // 隊伍數量與每隊人數必須大於 0
        if ((name === 'teamsCount' || name === 'teammatesPerTeam') && value <= 0) {
            return { borderColor: 'var(--danger)', borderWidth: '2px', outline: 'none' };
        }
        // 分數不應為負數
        if ((name === 'minScore' || name === 'maxScore') && value < 0) {
            return { borderColor: 'var(--danger)', borderWidth: '2px', outline: 'none' };
        }
        return {};
    };

    // 檢查設定值是否有效
    const isSettingsInvalid = 
        settings.teamsCount <= 0 || 
        settings.teammatesPerTeam <= 0 || 
        settings.minScore < 0 || 
        settings.maxScore < 0;

    // 介面翻譯字典
    const uiTexts = {
        zh: {
            title: "控制面板",
            richModeOn: "切換為流暢模式 (關閉特效)",
            richModeOff: "切換為精緻模式 (開啟特效)",
            darkMode: "切換深色/淺色模式",
            langSwitch: "切換語言 (Switch Language)",
            expand: "展開",
            collapse: "收合",
            teamsCount: "隊伍數",
            teammatesPerTeam: "每隊人數",
            minScore: "最小分",
            maxScore: "最大分",
            selectFile: "📂 選擇檔案",
            template: "📥 範本",
            preview: "👀 預覽",
            autoDraft: "🚀 自動選秀",
            nextPick: "➡️ 下一步",
            manualPick: "👆 手動選人",
            undo: "↩️ 上一步",
            swapHintSelected: (name) => `已選取: ${name} (點擊另一人交換)`,
            swapHintDefault: "💡 點擊/拖曳隊員可進行交換",
            exportScores: "匯出分數",
            exportResults: "💾 匯出結果",
            load: "📥 載入",
            reset: "🔄 重置",
            clear: "🗑️ 清除"
        },
        en: {
            title: "Control Panel",
            richModeOn: "Switch to Performance Mode",
            richModeOff: "Switch to Rich Mode",
            darkMode: "Toggle Dark/Light Mode",
            langSwitch: "Switch Language",
            expand: "Expand",
            collapse: "Collapse",
            teamsCount: "Teams",
            teammatesPerTeam: "Players/Team",
            minScore: "Min Score",
            maxScore: "Max Score",
            selectFile: "📂 Select File",
            template: "📥 Template",
            preview: "👀 Preview",
            autoDraft: "🚀 Auto Draft",
            nextPick: "➡️ Next Pick",
            manualPick: "👆 Manual Pick",
            undo: "↩️ Undo",
            swapHintSelected: (name) => `Selected: ${name} (Click to swap)`,
            swapHintDefault: "💡 Click/Drag to swap players",
            exportScores: "Export Scores",
            exportResults: "💾 Export",
            load: "📥 Load",
            reset: "🔄 Reset",
            clear: "🗑️ Clear"
        }
    };

    const t = uiTexts[language] || uiTexts.zh;

    return (
        <div className="control-panel">
            <div className="panel-header">
                <span className="panel-title">{t.title}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-outline btn-sm" onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} title={t.langSwitch}>
                        🌐 {language === 'zh' ? 'En' : '中'}
                    </button>
                    <button className="btn-outline btn-sm" onClick={toggleRichMode} title={isRichMode ? t.richModeOn : t.richModeOff}>
                        {isRichMode ? '💨' : '✨'}
                    </button>
                    <button className="btn-outline btn-sm" onClick={toggleDarkMode} title={t.darkMode}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button className="btn-outline btn-sm" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? t.expand : t.collapse}
                        <span className={`arrow-icon ${!isCollapsed ? 'rotated' : ''}`}>▼</span>
                    </button>
                </div>
            </div>

            <div className={`panel-body ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="panel-content">
                    {/* 第一區：設定與資料 */}
                    <div className="control-group settings-group">
                        <div className="input-row">
                            <div className="input-group">
                                <label>{t.teamsCount}</label>
                                <input 
                                    type="number" 
                                    name="teamsCount" 
                                    value={settings.teamsCount} 
                                    onChange={handleInputChange} 
                                    disabled={isDataLoaded} 
                                    style={getInputStyle('teamsCount', settings.teamsCount)}
                                />
                            </div>
                            <div className="input-group">
                                <label>{t.teammatesPerTeam}</label>
                                <input 
                                    type="number" 
                                    name="teammatesPerTeam" 
                                    value={settings.teammatesPerTeam} 
                                    onChange={handleInputChange} 
                                    disabled={isDataLoaded} 
                                    style={getInputStyle('teammatesPerTeam', settings.teammatesPerTeam)}
                                />
                            </div>
                            <div className="input-group">
                                <label>{t.minScore}</label>
                                <input 
                                    type="number" 
                                    name="minScore" 
                                    value={settings.minScore} 
                                    onChange={handleInputChange} 
                                    style={getInputStyle('minScore', settings.minScore)}
                                />
                            </div>
                            <div className="input-group">
                                <label>{t.maxScore}</label>
                                <input 
                                    type="number" 
                                    name="maxScore" 
                                    value={settings.maxScore} 
                                    onChange={handleInputChange} 
                                    style={getInputStyle('maxScore', settings.maxScore)}
                                />
                            </div>
                        </div>
                        
                        <div className="file-actions">
                            <div className="file-input-wrapper">
                                <button className="btn-outline btn-sm">{t.selectFile}</button>
                                <input type="file" accept=".xlsx, .xls" onChange={(e) => {
                                    onFileUpload(e);
                                    e.target.value = ''; 
                                }} />
                            </div>
                            <button className="btn-outline btn-sm" onClick={onDownloadTemplate}>
                                {t.template}
                            </button>
                            <button className="btn-outline btn-sm" onClick={onPreview} disabled={!hasFile}>
                                {t.preview}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 第二區：選秀操作 */}
            {isDataLoaded && !draftStatus.isDrafting && !draftStatus.isComplete && (
                <div className="control-group action-group">
                    <button className="btn-primary" onClick={() => onStartDraft(true)}>
                        {t.autoDraft}
                    </button>
                    <button className="btn-primary" onClick={onNextPick}>
                        {t.nextPick}
                    </button>
                    <button className="btn-primary" onClick={onManualPick}>
                        {t.manualPick}
                    </button>
                    <button className="btn-outline" onClick={onUndo} disabled={draftStatus.currentPickIndex === 0}>
                        {t.undo}
                    </button>
                </div>
            )}

            {/* 第三區：結果與系統 */}
            {draftStatus.isComplete && (
                <div className="control-group result-group">
                    <div className="swap-hint" style={{ color: swapSource ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '10px' }}>
                        {swapSource ? t.swapHintSelected(swapSource.player.name) : t.swapHintDefault}
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '0.95em' }}>
                        <input 
                            type="checkbox" 
                            checked={exportWithScores} 
                            onChange={(e) => setExportWithScores(e.target.checked)} 
                        />
                        {t.exportScores}
                    </label>

                    <button className="btn-success" onClick={onExport}>
                        {t.exportResults}
                    </button>
                </div>
            )}

            <div className="control-group system-group">
                <button className="btn-primary btn-sm" onClick={onLoadData} disabled={isDataLoaded || isSettingsInvalid}>
                    {t.load}
                </button>
                <button className="btn-outline btn-sm" onClick={onReset}>
                    {t.reset}
                </button>
                <button className="btn-outline btn-sm" onClick={onClearCache} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                    {t.clear}
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;