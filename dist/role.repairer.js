function repairer(creep) {
  let source = creep.pos.findClosestByPath(FIND_SOURCES)
  if (!source) {
    creep.pos.findClosestByRange(FIND_SOURCES)
  }

  if (creep.memory.repairing === true) {
    const repairSites = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax,
    })

    // if there is nothing to repair, don't clog up the energy sources or paths
    if (repairSites.length === 0) {
      creep.moveTo(Game.flags.repairerCamp)
    }

    repairSites.sort((a, b) => a.hits - b.hits)

    if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.repairing = false
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    } else {
      if (creep.repair(repairSites[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(repairSites[0])
      }
    }
  } else {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source)
    } else if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
      creep.memory.repairing = true
    }
  }
}

module.exports = repairer
