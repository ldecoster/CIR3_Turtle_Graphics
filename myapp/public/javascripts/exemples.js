(function() {
	$(':button').click(function() {
		var $target = $(this);
		textArea = $(this).prev()
		textArea.select();
		document.execCommand('copy');
		$target.attr('value', 'Exemple copié !');
		$target.addClass('btn-success');
		$target.removeClass('btn-primary');
	});

	$(':button').mouseout(function() {
		var $target = $(this);
		$target.attr('value', 'Copier l\'exemple dans le presse-papier');
		$target.removeClass('btn-success');
		$target.addClass('btn-primary');
	});
	
})();