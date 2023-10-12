<script lang="ts">
	export let type: 'connected' | 'connecting' | 'failed';

	const getColor = () => {
		switch (type) {
			case 'connecting':
				return 'fill-yellow-400';
			case 'connected':
				return 'fill-green-400';
			case 'failed':
				return 'fill-red-400';
			default:
				return 'fill-yellow-400';
		}
	};
</script>

<span
	class="inline-flex items-center gap-x-1.5 rounded-full px-4 text-xs font-medium bg-gray-100 text-gray-600"
>
	<svg class={`h-1.5 w-1.5 ${getColor()}`} viewBox="0 0 6 6" aria-hidden="true">
		<circle cx="3" cy="3" r="3" />
	</svg>
	Peer Connection
</span>
