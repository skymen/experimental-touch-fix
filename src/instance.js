function getInstanceJs(parentClass, scriptInterface, addonTriggers, C3) {
  let oldInstance = C3.Plugins.Touch.Instance;
  C3.Plugins.Touch.Instance = class extends oldInstance {
    constructor(inst, properties) {
      super(inst, properties);
    }

    _OnPointerMove(e) {
      if (this._useMouseInput && e["pointerType"] === "mouse") {
        // if the mouse buttons have changed, update the _isMouseDown state
        this._CheckButtonChanges(e["lastButtons"], e["buttons"], e);
      }
      super._OnPointerMove(e);
    }

    _CheckButtonChanges(lastButtons, buttons, e) {
      this._CheckButtonChange(lastButtons, buttons, 1, e) ||
        this._CheckButtonChange(lastButtons, buttons, 4, e) ||
        this._CheckButtonChange(lastButtons, buttons, 2, e);
    }
    _CheckButtonChange(lastButtons, buttons, checkButtonFlag, e) {
      if (!(lastButtons & checkButtonFlag) && buttons & checkButtonFlag) {
        this._OnPointerDown(e);
        return true;
      } else if (
        lastButtons & checkButtonFlag &&
        !(buttons & checkButtonFlag)
      ) {
        this._OnPointerUp(e);
        return true;
      }
      return false;
    }
  };
  return class extends parentClass {
    constructor(inst, properties) {
      super(inst);

      if (properties) {
      }
    }

    Release() {
      super.Release();
    }

    SaveToJson() {
      return {
        // data to be saved for savegames
      };
    }

    LoadFromJson(o) {
      // load state for savegames
    }

    Trigger(method) {
      super.Trigger(method);
      const addonTrigger = addonTriggers.find((x) => x.method === method);
      if (addonTrigger) {
        this.GetScriptInterface().dispatchEvent(new C3.Event(addonTrigger.id));
      }
    }

    GetScriptInterfaceClass() {
      return scriptInterface;
    }
  };
}
