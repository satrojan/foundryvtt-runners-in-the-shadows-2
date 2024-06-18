
import { BladesSheet } from "./blades-sheet.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {BladesSheet}
 */
export class BladesClockSheet extends BladesSheet {

  /** @override */
	static get defaultOptions() {
	  return foundry.utils.mergeObject(super.defaultOptions, {
  	  classes: ["runners-in-the-shadows", "sheet", "actor", "clock"],
  	  template: "systems/runners-in-the-shadows/templates/actors/clock-sheet.html",
      width: 420,
      height: 320,
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    var data = super.getData();
    data.editable = this.options.editable;
    const actorData = data.data;
    data.actor = actorData;
    data.data = actorData.data;
    return data;
  }

    /* -------------------------------------------- */

  /** @override */
  async _updateObject(event, formData) {
    let image_path = `systems/runners-in-the-shadows/styles/assets/progressclocks-svg/Progress Clock ${formData['data.type']}-${formData['data.value']}.svg`;
    formData['img'] = image_path;
    formData['token.img'] = image_path;
    let data = [];
    let update = {
      img: image_path,
      width: 1,
      height: 1,
      scale: 1,
      mirrorX: false,
      mirrorY: false,
      tint: "",
      displayName: 50
    };

    let tokens = this.actor.getActiveTokens();
    tokens.forEach( function( token ) {
      data.push(
        foundry.utils.mergeObject(
          { _id: token.id },
          update
        )
      );
    });
    await TokenDocument.updateDocuments( data, { parent: game.scenes.current } )

    // Update the Actor
    return this.object.update(formData);
  }

  /* -------------------------------------------- */

}
