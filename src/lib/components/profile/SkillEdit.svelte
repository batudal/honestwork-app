<script lang="ts">
	import { chosen_profile_tab, submitting, skill_add } from '$lib/stores/State';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base, assets } from '$app/paths';
	import { skill_upload_urls, chosen_skill_slot, changes_made } from '$lib/stores/State';
	import { userAddress } from '$lib/stores/Network';
	import { shortcut } from '$lib/stores/Shortcut';
	import { placeholder_image } from '$lib/stores/Constants';
	import Tiptap from '$lib/components/common/Tiptap.svelte';
	import { parseContent } from '$lib/stores/Parser';
	import { SkillInput } from '$lib/stores/Validation';
	import { toast } from '@zerodevx/svelte-toast';
	import { env } from '$env/dynamic/public';

	//todo: move images to img elements instead of div backgrounds (won't show ones with empty letter in its name)
	export let skill: SkillInput;

	let description_chars = 2000;
	let description_text = skill.description;
	let title: string = skill.title;
	let minimum: number = skill.minimumprice;
	let link_0: string = skill.links[0] || '';
	let link_1: string = skill.links[1] || '';
	let link_2: string = skill.links[2] || '';
	let file_url_0: string = skill.imageurls[0];
	let file_url_1: string = skill.imageurls[1];
	let file_url_2: string = skill.imageurls[2];
	let file_url_3: string = skill.imageurls[3];
	let file_url_4: string = skill.imageurls[4];
	let file_url_5: string = skill.imageurls[5];
	let file_url_6: string = skill.imageurls[6];
	let file_url_7: string = skill.imageurls[7];
	let image_url_0: string = skill.imageurls[0];
	let image_url_1: string = skill.imageurls[1];
	let image_url_2: string = skill.imageurls[2];
	let image_url_3: string = skill.imageurls[3];
	let image_url_4: string = skill.imageurls[4];
	let image_url_5: string = skill.imageurls[5];
	let image_url_6: string = skill.imageurls[6];
	let image_url_7: string = skill.imageurls[7];
	let comp_0: HTMLInputElement;
	let comp_1: HTMLInputElement;
	let comp_2: HTMLInputElement;
	let comp_3: HTMLInputElement;
	let comp_4: HTMLInputElement;
	let comp_5: HTMLInputElement;
	let comp_6: HTMLInputElement;
	let comp_7: HTMLInputElement;
	let title_input_element: HTMLInputElement;
	let title_input_length: number;
	let title_input_limit = 50;
	let tag_input: HTMLInputElement;
	let show_infobox = false;
	let publish: boolean = skill.publish;
	let tags: string[] = skill.tags;
	let content: string;
	let total_chars = 0;

	$: file_components = [comp_0, comp_1, comp_2, comp_3, comp_4, comp_5, comp_6, comp_7];
	$: if (
		title != skill.title ||
		link_0 != (skill.links ? skill.links[0] : '') ||
		link_1 != (skill.links ? skill.links[1] : '') ||
		link_2 != (skill.links ? skill.links[2] : '') ||
		description_text != skill.description ||
		image_url_0 != (skill.imageurls ? skill.imageurls[0] : '') ||
		image_url_1 != (skill.imageurls ? skill.imageurls[1] : '') ||
		image_url_2 != (skill.imageurls ? skill.imageurls[2] : '') ||
		image_url_3 != (skill.imageurls ? skill.imageurls[3] : '') ||
		image_url_4 != (skill.imageurls ? skill.imageurls[4] : '') ||
		image_url_5 != (skill.imageurls ? skill.imageurls[5] : '') ||
		image_url_6 != (skill.imageurls ? skill.imageurls[6] : '') ||
		image_url_7 != (skill.imageurls ? skill.imageurls[7] : '') ||
		minimum != skill.minimumprice ||
		publish != skill.publish ||
		tags != skill.tags
	) {
		changes_made.set(true);
	} else {
		changes_made.set(false);
	}
	onMount(() => {
		updateInputLengths();
	});

	const uploadPhoto = async (e: any) => {
		const file = e.target.files[0]!;
		if (file == null) return;
		const reader = new FileReader();
		reader.onload = function () {
			if (typeof reader.result == 'string') {
				if (e.srcElement.name == 'file_url_0') image_url_0 = reader.result;
				if (e.srcElement.name == 'file_url_1') image_url_1 = reader.result;
				if (e.srcElement.name == 'file_url_2') image_url_2 = reader.result;
				if (e.srcElement.name == 'file_url_3') image_url_3 = reader.result;
				if (e.srcElement.name == 'file_url_4') image_url_4 = reader.result;
				if (e.srcElement.name == 'file_url_5') image_url_5 = reader.result;
				if (e.srcElement.name == 'file_url_6') image_url_6 = reader.result;
				if (e.srcElement.name == 'file_url_7') image_url_7 = reader.result;
			}
		};
		reader.readAsDataURL(file);
		let urls = $skill_upload_urls;

		for (let i = 0; i < 10; i++) {
			urls[i] = Array<Response>;
		}

		for (let i = 0; i < 8; i++) {
			if (e.srcElement.name == `file_url_${i}`) {
				// @ts-expect-error
				urls[$chosen_skill_slot][i] = await fetch(
					`/api/upload-skill-url/${$chosen_skill_slot}/${i}/${e.target.files[0].name}`
				);
			}
		}
		skill_upload_urls.set(urls);
	};

	const submitSkills = async () => {
		submitting.set(true);
		let cloud_url_0 =
			comp_0.files && comp_0.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/0/' +
				  comp_0.files[0].name
				: skill.imageurls[0] ?? '';
		let cloud_url_1 =
			comp_1.files && comp_1.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/1/' +
				  comp_1.files[0].name
				: skill.imageurls[1] ?? '';
		let cloud_url_2 =
			comp_2.files && comp_2.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/2/' +
				  comp_2.files[0].name
				: skill.imageurls[2] ?? '';
		let cloud_url_3 =
			comp_3.files && comp_3.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/3/' +
				  comp_3.files[0].name
				: skill.imageurls[3] ?? '';
		let cloud_url_4 =
			comp_4.files && comp_4.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/4/' +
				  comp_4.files[0].name
				: skill.imageurls[4] ?? '';
		let cloud_url_5 =
			comp_5.files && comp_5.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/5/' +
				  comp_5.files[0].name
				: skill.imageurls[5] ?? '';
		let cloud_url_6 =
			comp_6.files && comp_6.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/6/' +
				  comp_6.files[0].name
				: skill.imageurls[6] ?? '';
		let cloud_url_7 =
			comp_7.files && comp_7.files[0]
				? env.PUBLIC_IMAGEKIT_URL +
				  '/' +
				  $userAddress +
				  '/skill/' +
				  $chosen_skill_slot +
				  '/7/' +
				  comp_7.files[0].name
				: skill.imageurls[7] ?? '';
		const input: SkillInput = {
			useraddress: $userAddress,
			title: title,
			description: content,
			tags: tags,
			links: [link_0, link_1, link_2],
			imageurls: [
				cloud_url_0,
				cloud_url_1,
				cloud_url_2,
				cloud_url_3,
				cloud_url_4,
				cloud_url_5,
				cloud_url_6,
				cloud_url_7
			],
			minimumprice: minimum,
			publish: publish
		};
		console.log('Input:', input);
		let parsed = SkillInput.safeParse(input);
		if (!parsed.success) {
			for (let i = 0; i < parsed.error.errors.length; i++) {
				toast.push(
					`<p class="light-60"><span style='color:var(--color-error)'>${parsed.error.errors[i].path}: </span>${parsed.error.errors[i].message}</p>`
				);
			}
			return;
		}
		let counter = 0;
		for await (let t of file_components) {
			if (t.files != null && t.files.length > 0) {
				const file = t.files[0];
				//@ts-expect-error
				let clone_response = $skill_upload_urls[$chosen_skill_slot][counter].clone();
				const { url, fields } = await clone_response.json();
				const formData = new FormData();
				Object.entries({ ...fields, file }).forEach(([key, value]) => {
					formData.append(key, value as string);
				});
				const upload = await fetch(url, {
					method: 'POST',
					body: formData
				});
				if (upload.ok) {
					toast.push(
						`<p class="light-60"><span style='color:var(--color-success)'>success: </span>Uploaded file #${
							counter + 1
						}</p>`
					);
				} else {
					toast.push(
						`<p class="light-60"><span style='color:var(--color-error)'>error: </span>Upload failed</p>`
					);
					return;
				}
			}
			counter++;
		}
		let url: string;
		if ($skill_add) {
			url = `${base}/api/skill_add`;
		} else {
			url = `${base}/api/skill_update/${$chosen_skill_slot}`;
		}
		let response = await fetch(url, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json'
			}),
			body: JSON.stringify(input)
		});
		if (response.ok) {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-success)'>success: </span>Skill updated</p>`
			);
			changes_made.set(false);
			submitting.set(false);
			chosen_profile_tab.set('skills');
			if (browser) window.location.reload();
		} else {
			toast.push(
				`<p class="light-60"><span style='color:var(--color-error)'>error: </span>${response.status}</p>`
			);
			submitting.set(false);
		}
	};

	const updateInputLengths = () => {
		title_input_length = title_input_element?.value.length ?? skill.title.length;
	};
	const handleTagEntry = (e: any) => {
		if (e.target?.value !== '' && e.pointerType != 'mouse') tags.push(e.target?.value);
		tags = tags;
		tag_input.value = '';
	};
	const handleRemoveTag = (index: number) => {
		tags.splice(index, 1);
		tags = tags;
	};
	const handleContentInput = (e: any) => {
		content = JSON.stringify(e.detail.content);
		total_chars = parseContent(content).length;
	};
</script>

<div class="save-changes">
	<div class="external-page" on:click={() => chosen_skill_slot.set(-1)} on:keydown>
		<img src={`${assets}/icons/arrow-left-box.svg`} alt="Skills Tab" />
		<div style="width:4px" />
		<p class="yellow link">back to skills</p>
	</div>
	<div class="external-page">
		{#if $submitting}
			<img
				src={`${assets}/icons/loader.svg`}
				alt="loading"
				class="rotating"
				style="height:16px;width:16px;"
			/>
			<div style="width:4px;" />
		{/if}
		<p
			class={`semibold link ${$changes_made ? 'yellow' : 'light-60'}`}
			on:click={submitSkills}
			on:keydown
		>
			save changes
		</p>
	</div>
</div>
<div style="height:16px;" />
<section>
	<div class="publish-bar">
		<input hidden type="number" name="skill_slot" value={$chosen_skill_slot} />
		<input hidden type="text" name="user_address" value={$userAddress} />
		<input hidden type="checkbox" name="publish" bind:checked={publish} />
		<input hidden type="text" name="description" bind:value={content} />
		<!-- {#if publish} -->
		<!-- 	<p class="light-60">status: <span class="light">published</span></p> -->
		<!-- 	<p class="yellow" on:click={() => (publish = !publish)} on:keydown style="cursor:pointer;"> -->
		<!-- 		unpublish -->
		<!-- 	</p> -->
		<!-- {:else} -->
		<!-- 	<p class="light-60">status: <span class="light">unpublished</span></p> -->
		<!-- 	<p class="yellow" on:click={() => (publish = !publish)} on:keydown style="cursor:pointer;"> -->
		<!-- 		publish -->
		<!-- 	</p> -->
		<!-- {/if} -->
		<div
			class="input-field"
			on:click={() => (publish = !publish)}
			on:keydown
			style="cursor:pointer; height:100%;"
		>
			<div style="display:flex;flex-direction:row;">
				{#if publish}
					<img src={`${assets}/icons/checked.svg`} alt="Checked" style="height:16px;width:16px;" />
					<div style="width:8px" />
					<p class="yellow">
						published <span class="light-60">other people can see your skill</span>
					</p>
				{:else}
					<img
						src={`${assets}/icons/unchecked.svg`}
						alt="Checked"
						style="height:16px;width:16px;"
					/>
					<div style="width:8px" />
					<p class="yellow">
						not published <span class="light-60">other people can't see your skill</span>
					</p>
				{/if}
			</div>
		</div>
	</div>
</section>
<div style="height:8px;" />
<section
	class="gallery"
	on:mouseover={() => (show_infobox = true)}
	on:focus
	on:mouseout={() => {
		show_infobox = false;
	}}
	on:blur
>
	{#if show_infobox}
		<section class="infobox">
			<p class="light-60">
				images should be <span class="yellow">4:3</span> ratio for best results.<br /><br />files
				cannot exceed
				<span class="yellow">5mb</span>.<br /><br />accepted formats;
				<span class="yellow">png/jpeg/jpg</span>
			</p>
		</section>
	{/if}
	<div
		class="image-card"
		style={`background-image:url(${
			file_url_0 == skill.imageurls[0]
				? file_url_0 + '?tr=h-180,w-240'
				: image_url_0 != ''
				? image_url_0
				: placeholder_image
		})`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_0`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_0}
			bind:this={comp_0}
		/>
		<input hidden type="number" name="image_slot_0" value="0" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_1 == skill.imageurls[1]
				? file_url_1 + '?tr=h-180,w-240'
				: image_url_1 != ''
				? image_url_1
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_1`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_1}
			bind:this={comp_1}
		/>
		<input hidden type="number" name="image_slot_1" value="1" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_2 == skill.imageurls[2]
				? file_url_2 + '?tr=h-180,w-240'
				: image_url_2 != ''
				? image_url_2
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_${2}`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_2}
			bind:this={comp_2}
		/>
		<input hidden type="number" name="image_slot_2" value="2" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_3 == skill.imageurls[3]
				? file_url_3 + '?tr=h-180,w-240'
				: image_url_3 != ''
				? image_url_3
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_${3}`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_3}
			bind:this={comp_3}
		/>
		<input hidden type="number" name="image_slot_3" value="3" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_4 == skill.imageurls[4]
				? file_url_4 + '?tr=h-180,w-240'
				: image_url_4 != ''
				? image_url_4
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_${4}`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_4}
			bind:this={comp_4}
		/>
		<input hidden type="number" name="image_slot_4" value="4" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_5 == skill.imageurls[5]
				? file_url_5 + '?tr=h-180,w-240'
				: image_url_5 != ''
				? image_url_5
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_${5}`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_5}
			bind:this={comp_5}
		/>
		<input hidden type="number" name="image_slot_5" value="5" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_6 == skill.imageurls[6]
				? file_url_6 + '?tr=h-180,w-240'
				: image_url_6 != ''
				? image_url_6
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_${6}`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_6}
			bind:this={comp_6}
		/>
		<input hidden type="number" name="image_slot_6" value="6" />
	</div>
	<div
		class="image-card"
		style={`background-image:url('${
			file_url_7 == skill.imageurls[7]
				? file_url_7 + '?tr=h-180,w-240'
				: image_url_7 != ''
				? image_url_7
				: placeholder_image
		}')`}
	>
		<div class="image-tint" />
		<div class="upload-button">
			<img src={`${assets}/icons/upload.svg`} alt="Upload" />
			<div style="height:4px;" />
			<p class="yellow">UPLOAD IMAGE</p>
		</div>
		<input
			name={`file_url_${7}`}
			class="file-input"
			type="file"
			accept="image/png, image/jpeg"
			on:change={uploadPhoto}
			bind:value={file_url_7}
			bind:this={comp_7}
		/>
		<input hidden type="number" name="image_slot_7" value="7" />
	</div>
</section>
<div style="height:16px;" />
<div class="input-fields">
	<div class="input-field">
		<div class="placeholder">
			<p class="light-40">title</p>
		</div>
		<input
			name="title"
			class="flex-input"
			type="text"
			placeholder={title}
			maxlength={title_input_limit}
			bind:value={title}
			bind:this={title_input_element}
			on:keyup={updateInputLengths}
		/>
		<div class="limit">
			<p><span class="yellow">{title_input_length}</span>/{title_input_limit}</p>
		</div>
	</div>
	<div style="height:8px;" />
	<div class="input-field">
		<div class="placeholder">
			<p class="light-40">hourly price ($)</p>
		</div>
		<input
			name="minimum_price"
			class="flex-input"
			type="number"
			placeholder={minimum?.toString()}
			bind:value={minimum}
		/>
	</div>
</div>
<div style="height:16px;" />
<div class="input-field">
	<div class="placeholder">
		<p class="light-40">tags</p>
	</div>
	<input
		class="flex-input"
		type="text"
		use:shortcut={{ code: 'Enter' }}
		on:click={(e) => handleTagEntry(e)}
		bind:this={tag_input}
		placeholder="enter at least 1 tag"
	/>
</div>
<div style="height:8px" />
{#if tags.length > 0}
	<div class="tags">
		{#each tags as tag, i}
			<div class="tag" on:click={() => handleRemoveTag(i)} on:keydown>
				<p class="light-60">{tag}</p>
				<div class="close-icon" />
			</div>
		{/each}
	</div>
{/if}
<div style="height:16px;" />
<div class="input-fields">
	<div class="input-field">
		<div class="placeholder">
			<p class="light-40">link</p>
		</div>
		<input name={`link-0`} class="flex-input" type="text" bind:value={link_0} />
	</div>
	<div style="height:8px;" />
	<div class="input-field">
		<div class="placeholder">
			<p class="light-40">link</p>
		</div>
		<input name={`link-1`} class="flex-input" type="text" bind:value={link_1} />
	</div>
	<div style="height:8px;" />
	<div class="input-field">
		<div class="placeholder">
			<p class="light-40">link</p>
		</div>
		<input name={`link-2`} class="flex-input" type="text" bind:value={link_2} />
	</div>
</div>
<div style="height:16px;" />
<div class="description">
	<div class="description-bar">
		<section class="description-title"><p class="light-40">description</p></section>
		<p class="chars light-60"><span class="yellow">{total_chars}</span>/{description_chars}</p>
	</div>
	<div class="bio">
		<Tiptap
			on:content={handleContentInput}
			content={skill.description != '' ? JSON.parse(skill.description) : ''}
		/>
	</div>
</div>

<style>
	.bio {
		width: 100%;
		height: 100%;
	}
	.gallery {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 7px;
		width: 520px;
		flex-wrap: wrap;
		gap: 8px;
	}
	.image-card {
		height: 90px;
		width: 120px;
		background-size: cover;
		background-repeat: no-repeat;
		cursor: pointer;
		position: relative;
		border: solid 1px var(--color-light-20);
		box-sizing: border-box;
	}
	.image-tint {
		position: absolute;
		height: 90px;
		width: 120px;
		background-color: rgba(0, 0, 0, 0.9);
		display: none;
	}
	.image-card:hover .image-tint {
		display: block;
	}
	.upload-button {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
		display: none;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.image-card:hover .upload-button {
		display: flex;
	}

	.image-card:hover {
		border: none;
	}
	.file-input {
		opacity: 0;
		width: 120px;
		height: 90px;
		cursor: pointer;
	}
	.input-fields {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	.input-field {
		display: flex;
		flex-direction: row;
		min-width: 320px;
		justify-content: flex-start;
		height: 32px;
		position: relative;
	}
	.flex-input {
		flex: 1;
		background-color: var(--color-dark);
	}
	.placeholder {
		height: 32px;
		display: flex;
		background-color: var(--color-dark);
		border-width: 1px 0px 1px 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		padding: 8px;
	}
	.description {
		position: relative;
	}
	.description-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-size: 13px;
		line-height: 16px;
		align-items: center;
	}
	.description-title {
		padding: 8px;
		border-width: 1px 1px 0px 1px;
	}
	.limit {
		position: absolute;
		right: 12px;
		transform: translateY(50%);
	}
	.infobox {
		width: 240px;
		padding: 8px;
		position: absolute;
		margin-left: 520px;
		margin-top: -8px;
	}
	.publish-bar {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 8px;
	}
	.tags {
		width: calc(100% - 100px);
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tag {
		padding: 8px;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;
	}
	.tag:hover {
		background-color: var(--color-light-2);
	}
	.tag > p {
		font-size: 11px;
		line-height: 12px;
	}
	.tag:hover .close-icon {
		background: url('icons/close.svg');
	}
	.save-changes {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 8px;
		border-width: 1px;
		border-style: solid;
		border-color: var(--color-light-20);
	}
	.external-page {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.external-page img {
		height: 16px;
		width: 16px;
	}
</style>
