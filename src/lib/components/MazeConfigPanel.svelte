<script lang="ts">
    import { submitNewMaze, updateMaze } from "../../firebase";
    import { mazeDataToMazeDocument } from "../../lib";

    export let mazeData: MazeData;
    let mazeId = mazeData.id;

    function handleSaveIntention() {
        // Convert mazeData to MazeDocument

		let mazeDocument = mazeDataToMazeDocument(mazeData);

        console.log("Attempting to save maze with id: ", mazeId)
		// Save the maze to firebase
		updateMaze(mazeDocument)
			.then(() => console.log('save successful'))
			.catch(error => console.log('save failed', error));
    }

    function handleMazeCreateIntention() {
        // convert MazeData to a MazeDocument
        // let mazeDocument = mazeDataToMazeDocument(mazeData)

        submitNewMaze(mazeData) //TODO change this to accept MazeData, instead of an incomplete mazeDocument
    }
</script>

<div class="bg-slate-200 rounded-md p-4">
    <div>
        <h3 class='text-lg py-2'>Settings</h3>
    </div>
    <h3 class='text-lg py-2'>Validation Checks</h3>
    <div>
        <label for="hasStartSquare">Starting Square</label>
        <input type="checkbox" id="hasStartSquare" checked={true}/>
        <label for="hasFinishSquare">Finish Square</label>
        <input type="checkbox" id="hasFinishSquare" checked={true}/>
    </div>
    
    {#if mazeId }
    <button class="bg-slate-500 text-white p-2 rounded-md" on:click={() => { handleSaveIntention() }}>
        Save
    </button>
    {:else}
    <button class="bg-slate-500 text-white p-2 rounded-md" on:click={() => { handleMazeCreateIntention() }}>
        Create as New
    </button>
    {/if}
</div>

<style></style>