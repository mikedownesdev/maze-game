<script lang="ts">
    import { submitNewMaze } from "../../firebase";

    export let size: number;
    export let mazeData: MazeData;
    $: numberOfWalls = mazeData.squares.reduce((totalWalls, row) => {
		return (
			totalWalls +
			row.reduce((rowWalls, square) => {
				return rowWalls + (square.isWall ? 1 : 0);
			}, 0)
		);
	}, 0);

    function handleClick() {
        console.log("clicked")
        // convert MazeData to a MazeDocument
        var newObject: {
            [key: string]: SquareData[]
        } = {}
        mazeData.squares.forEach((row: SquareData[], index: number) => {
            const indexString = index.toString();
            newObject[indexString] = row;
        })
        const mazeDocument: MazeDocument = {
            squares: newObject,
            size: mazeData.size,
        }
        console.log(mazeDocument)
        submitNewMaze(mazeDocument)
    }
</script>

<div class="bg-slate-200 rounded-md p-4">
    <div>
        <h3 class='text-lg py-2'>Settings</h3>
        <label for="size">Size</label>
        <input class="p-2" type="number" max="20" bind:value={size} />
        <p>{numberOfWalls}</p>
    </div>
    <h3 class='text-lg py-2'>Validation Checks</h3>
    <div>
        <label for="hasStartSquare">Starting Square</label>
        <input type="checkbox" id="hasStartSquare" checked={true}/>
        <label for="hasFinishSquare">Finish Square</label>
        <input type="checkbox" id="hasFinishSquare" checked={true}/>
    </div>
    <button class="bg-slate-500 text-white p-2 rounded-md" on:click={() => {
        handleClick()
    }}>Save</button>
</div>

<style></style>