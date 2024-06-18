/**
 * Extend the basic ItemSheet
 * @extends {ItemSheet}
 */
// import {onManageActiveEffect, prepareActiveEffectCategories} from "./effects.js";
import {BladesActiveEffect} from "./blades-active-effect.js";

export class BladesItemSheet extends ItemSheet {

  /** @override */
	static get defaultOptions() {

	  return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["runners-in-the-shadows", "sheet", "item"],
			width: 560,
			height: 'auto',
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
		});
  }

  /* -------------------------------------------- */

  /** @override */
  get template() {
    const path = "systems/runners-in-the-shadows/templates/items";
    let simple_item_types = ["background", "heritage", "lineage", "vice", "crew_reputation"];
    let template_name = `${this.item.data.type}`;

    if (simple_item_types.indexOf(this.item.data.type) >= 0) {
      template_name = "simple";
    }

    return `${path}/${template_name}.html`;
  }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find(".effect-control").click(ev => {
      if ( this.item.isOwned ) return ui.notifications.warn(game.i18n.localize("RITS.EffectWarning"))
      BladesActiveEffect.onManageActiveEffect(ev, this.item)
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.isGM = game.user.isGM;
    data.editable = this.options.editable;
    const itemData = data.data;
    data.actor = itemData;
    data.data = itemData.data;

    // Prepare Active Effects
    data.effects = BladesActiveEffect.prepareActiveEffectCategories(this.item.effects);

    return data;
  }
}
