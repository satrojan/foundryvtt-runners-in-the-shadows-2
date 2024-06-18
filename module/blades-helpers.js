export class BladesHelpers {

  /**
   * Identifies duplicate items by type and returns a array of item ids to remove
   *
   * @param {Object} item_data
   * @param {Document} actor
   * @returns {Array}
   *
   */
  static removeDuplicatedItemType(item_data, actor) {
    let dupe_list = [];
    let distinct_types = ["crew_type", "crew_reputation", "class", "vice", "background", "heritage", "prison"];
    let allowed_types = ["item"];
    let should_be_distinct = distinct_types.includes(item_data.type);
    // If the Item has the exact same name - remove it from list.
    // Remove Duplicate items from the array.
    actor.items.forEach( i => {
      let has_double = (item_data.type === i.type);
      if ( ( ( i.name === item_data.name ) || ( should_be_distinct && has_double ) ) && !( allowed_types.includes( item_data.type ) ) && ( item_data._id !== i.id ) ) {
        dupe_list.push (i.id);
      }
    });

    return dupe_list;
  }

  /**
   * Get a nested dynamic attribute.
   * @param {Object} obj
   * @param {string} property
   */
  static getNestedProperty(obj, property) {
    return property.split('.').reduce((r, e) => {
        return r[e];
    }, obj);
  }


  /**
   * Add item functionality
   */
  static _addOwnedItem(event, actor) {

    event.preventDefault();
    const a = event.currentTarget;
    const item_type = a.dataset.itemType;

    let data = {
      name: randomID(),
      type: item_type
    };
    return actor.createEmbeddedDocuments("Item", [data]);
  }

  /**
   * Get the list of all available ingame items by Type.
   *
   * @param {string} item_type
   * @param {Object} game
   */
  static async getAllItemsByType(item_type, game) {

    let list_of_items = [];
    let game_items = [];
    let compendium_items = [];

    game_items = game.items.filter(e => e.type === item_type).map(e => {return e.toObject()});

    let pack = game.packs.find(e => e.metadata.name === item_type);
    let compendium_content = await pack.getDocuments();
    compendium_items = compendium_content.map(e => {return e.toObject()});

    list_of_items = game_items.concat(compendium_items);
    list_of_items.sort(function(a, b) {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      return nameA.localeCompare(nameB);
    });
    return list_of_items;

  }

  /* -------------------------------------------- */

  /**
   * Returns the label for attribute.
   *
   * @param {string} attribute_name
   * @returns {string}
   */
  static getAttributeLabel(attribute_name) {
        let attribute_labels = {};
        const attributes = game.model.Actor.character.attributes;

        for (const att_name in attributes) {
          attribute_labels[att_name] = attributes[att_name].label;
          for (const skill_name in attributes[att_name].skills) {
            attribute_labels[skill_name] = attributes[att_name].skills[skill_name].label;
          }

        }

        return attribute_labels[attribute_name];
  }

  /**
   * Returns the label for roll type.
   *
   * @param {string} roll_name
   * @returns {string}
   */
  static getRollLabel(roll_name) {
    let attribute_labels = {};
    const attributes = game.model.Actor.character.attributes;

    for (const att_name in attributes) {
      if (att_name == roll_name) {
        return attributes[att_name].label;
      }
      for (const skill_name in attributes[att_name].skills) {
        if (skill_name == roll_name) {
          return attributes[att_name].skills[skill_name].label;
        }
      }
    }

    return roll_name;
  }

  /**
   * Returns true if the attribute is an action
   *
   * @param {string} attribute_name
   * @returns {Boolean}
   */
  static isAttributeAction(attribute_name) {
    const attributes = game.model.Actor.character.attributes;

    for (const att_name in attributes) {
      for (const skill_name in attributes[att_name].skills) {
        if (skill_name == attribute_name) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Returns true if the attribute is an attribute
   *
   * @param {string} attribute_name
   * @returns {Boolean}
   */
  static isAttributeAttribute(attribute_name) {
    const attributes = game.model.Actor.character.attributes;

    return (attribute_name in attributes);
  }

  /* -------------------------------------------- */
  static getProperCase( name ) {
    return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
  }
  /**
   * Creates options for faction clocks.
   *
   * @param {int[]} sizes
   *  array of possible clock sizes
   * @param {int} default_size
   *  default clock size
   * @param {int} current_size
   *  current clock size
   * @returns {string}
   *  html-formatted option string
   */
  static createListOfClockSizes( sizes, default_size, current_size ) {

    let text = ``;

    sizes.forEach( size => {
      text += `<option value="${size}"`;
      if ( !( current_size ) && ( size === default_size ) ) {
        text += ` selected`;
      } else if ( size === current_size ) {
        text += ` selected`;
      }

      text += `>${size}</option>`;
    });

    return text;

  }
  // adds an NPC to the character as an acquaintance of neutral standing
  static async addAcquaintance(actor, acq){
    let current_acquaintances = actor.system.acquaintances;
    let acquaintance = {
      id : acq.id,
      name : acq.name,
      description_short : acq.system.description_short,
      standing: "neutral"
     };
     let unique_id =  !current_acquaintances.some((oldAcq) => {
       return oldAcq.id == acq.id;
     });
     if(unique_id){
       await actor.update({system: {acquaintances : current_acquaintances.concat([acquaintance])}});
     }
     else{
       ui.notifications.info("The dropped NPC is already an acquaintance of this character.");
    }
  }
   static async removeAcquaintance(actor, acqId){
    let current_acquaintances = actor.system.acquaintances;
    let updated_acquaintances = current_acquaintances.filter(acq => acq._id !== acqId && acq.id !== acqId);
	await actor.update({system: {acquaintances : updated_acquaintances}});
  }

  static async getAllItemsByType(item_type) {

    let list_of_items = [];
    let world_items = [];
    let compendium_items = [];

    if(item_type === "npc"){
      world_items = game.actors.filter(e => e.type === item_type).map(e => {return e});
    }
    else{
      world_items = game.items.filter(e => e.type === item_type).map(e => {return e});
    }

    let pack = game.packs.find(e => e.metadata.name === item_type);
    let compendium_content = await pack.getDocuments();
    compendium_items = compendium_content.map(e => {return e});

    list_of_items = world_items.concat(compendium_items);
    list_of_items.sort(function(a, b) {
      let nameA = a.name.toUpperCase();
      let nameB = b.name.toUpperCase();
      return nameA.localeCompare(nameB);
    });
    return list_of_items;

  }

  static async getSourcedItemsByType(item_type){
      const limited_items = await this.getAllItemsByType(item_type);
    return limited_items;
  }
    static async getItemByType(item_type, item_id){
    let game_items = await this.getAllItemsByType(item_type);
    let item = game_items.find(item => item.id === item_id);
    return item;
  }

  static async getPlaybookAcquaintances(actor_type, selected_playbook){
    let all_acquaintances = await this.getSourcedItemsByType('npc');
	let playbook_acquaintances = [];
	if (actor_type == "character") {
		playbook_acquaintances = all_acquaintances.filter(i => i.system.associated_class === selected_playbook);
	} else if (actor_type == "crew") {
		playbook_acquaintances = all_acquaintances.filter(i => i.system.associated_crew_type === selected_playbook);
	}
	return playbook_acquaintances;

  }

  	static async import_pb_contacts(actor, playbook){
	  const pb_type = await actor.type;
	  const pb_actor = await this.getPlaybookAcquaintances(pb_type, playbook);
	  const LM = pb_actor.length;
	  let i = 0;
	  while(i<LM){
	  const new_acq= pb_actor[i];
	  await this.addAcquaintance(actor, new_acq);
	  i++;}
	}

}
