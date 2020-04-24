<controls>

  <h3>Editor</h3>

  <form>
      <label>Tool: <select ref="toolSelect" oninput={changeTool}>
          <option value="line">Line</option>
          <option value="half-circle">Half Circle</option>
          <option value="quarter-circle">Quarter Circle</option>
          <option value="full-circle">Full Circle</option>
      </select></label>
      <label><input ref="symmetry" type="checkbox" oninput={changeSymmetry}><del> symmetry on</del></label>
      <label><input ref="infinite" type="checkbox" oninput={changeInfinite}> infinite lines</label>
      <label><input ref="highlight" type="checkbox" oninput={changeHighlight}> highlight (red strokes)</label>
      <label><input ref="visible" type="checkbox" checked="checked" oninput={changeVisible}> visible</label>
      <br/>
      <button ref="undo" onclick={undo}>Undo</button>
      <br/>
      <label><input ref="showInvisibles" type="checkbox" checked="checked" oninput={showInvisibles}> show "invisible" strokes</label>
      <br/>
      <label><input ref="showDefaults" type="checkbox" checked="checked" oninput={showDefaults}> show "construction" strokes</label>
      <br/>
      <label><input ref="showAnchors" type="checkbox" checked="checked" oninput={showAnchors}> show intersection points</label>
  </form>
  <form>
      <label>Degree of symmetry (Disabled for now!): <input ref="symmetryDegree" type="number" value="4" step="2" oninput={changeSymmetryDegree}></input></label>
  </form>
  <br/>
  <div id="steps">
      <p>0: L(UL, LL), G, F</p>
      <p>1: L(LL, LR), G, F</p>
      <p>2: L(UR, LR), G, F</p>
      <p>3: L(UL, UR), G, F</p>
      <p>4: L(UC, LC), G, F</p>
      <p>5: L(CL, CR), G, F</p>
    </div>

  <div id="strokeTree"></div>

  <script>
    this.points=[1, 2, 3]
    this.items = []
    this.strokes = []
    this.currentIsArc = false;

    edit(e) {
      this.text = e.target.value
      this.currentIsArc = this.refs.strokeType.value == "arc"
    }

    changeTool(e) {
        if (this.refs.toolSelect.value == "line") {
            currentTool = 0;
        } else if (this.refs.toolSelect.value == "half-circle") {
            currentTool = 1;
            arcFactor = 1;
        } else if (this.refs.toolSelect.value == "quarter-circle") {
            currentTool = 1;
            arcFactor = 0.4;
        } else if (this.refs.toolSelect.value == "full-circle") {
            currentTool = 2;
        }
    }

    changeInfinite(e) {
        if (this.refs.infinite.checked) {
            drawInfinite = true;
        } else {
            drawInfinite = false;
        }
    }

    changeSymmetry(e) {
        if (this.refs.symmetry.checked) {
            drawSymmetry = true;
        } else {
            drawSymmetry = false;
        }
    }

    changeSymmetryDegree(e) {
        symmetryDeg = this.refs.symmetryDegree.value;
    }

    changeHighlight(e) {
        if (this.refs.highlight.checked) {
            drawColor = highlightColor;
        } else {
            drawColor = defaultColor;
        }
    }

    changeVisible(e) {
        if (this.refs.visible.checked) {
            drawVisible = true;
        } else {
            drawVisible = false;
        }
    }

    showInvisibles(e) {
        if (this.refs.showInvisibles.checked) {
            invisibleGroup.opacity = 1;
        } else {
            invisibleGroup.opacity = 0;
        }
    }

    showDefaults(e) {
        if (this.refs.showDefaults.checked) {
            constructionGroup.opacity = 1;
        } else {
            constructionGroup.opacity = 0;
        }
    }

    showAnchors(e) {
        if (this.refs.showAnchors.checked) {
            anchorGroup.opacity = 11;
        } else {
            anchorGroup.opacity = 0;
        }
    }

    undo(e) {
        e.preventDefault();
        undo();
    }

    add(e) {
      e.preventDefault()
      var currentStroke = new Object()
      currentStroke['html'] = $("#newStroke").clone(true, true)
      strokes.push(currentStroke)
    }
  </script>

</controls>
